import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

interface CkanPackage {
  title: string;
  notes?: string;
}

interface CkanSearchResponse {
  success: boolean;
  result?: CkanPackage;
}

interface RegistroAreaRisco {
  bairro: string;
  localidade: string;
  latitude: number;
  longitude: number;
}

interface CkanDatastoreResponse {
  success: boolean;
  result?: {
    records: RegistroAreaRisco[];
  };
}

export interface DadosAreasRisco {
  titulo: string;
  descricao: string;
  urlDados: string;
}

export interface AvisoAreaRisco {
  encontrada: boolean;
  titulo: string;
  mensagem: string;
  registros: number;
}

export interface AvisoMeteorologico {
  titulo: string;
  mensagem: string;
  nivel: 'atencao' | 'normal';
}

interface PrevisaoMeteorologica {
  current?: {
    precipitation?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  hourly?: {
    precipitation_probability?: number[];
  };
}

interface ResultadoGeocodificacao {
  name: string;
  latitude: number;
  longitude: number;
}

interface RespostaGeocodificacao {
  results?: ResultadoGeocodificacao[];
}

@Injectable({ providedIn: 'root' })
export class AreasRiscoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api-recife/api/3/action/package_show?id=defesa-civil';
  private readonly registrosUrl = '/api-recife/api/3/action/datastore_search?resource_id=75344435-aca8-4aef-ab2c-9521d6e5ff18&limit=5000';
  private readonly climaUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly geocodificacaoUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  buscar(): Observable<DadosAreasRisco> {
    return this.http.get<CkanSearchResponse>(this.apiUrl).pipe(
      map(response => {
        const pacote = response.result;

        if (!response.success || !pacote) {
          throw new Error('O conjunto oficial de áreas de risco não foi encontrado.');
        }

        return {
          titulo: pacote.title,
          descricao: pacote.notes || 'Dados oficiais de monitoramento das áreas de risco do Recife.',
          urlDados: 'https://dados.recife.pe.gov.br/dataset/defesa-civil'
        };
      })
    );
  }

  buscarAviso(endereco: string, coordenadas?: { lat: number; lng: number }): Observable<AvisoAreaRisco> {
    return this.http.get<CkanDatastoreResponse>(this.registrosUrl).pipe(
      map(response => {
        if (!response.success || !response.result) {
          throw new Error('A API não retornou os registros de áreas de risco.');
        }

        const registros = response.result.records;
        const termoEndereco = this.normalizar(endereco);
        const encontrados = registros.filter(registro => {
          const bairro = this.normalizar(registro.bairro);
          const localidade = this.normalizar(registro.localidade);
          const correspondeAoBairro = termoEndereco.length > 2
            && (termoEndereco.includes(bairro) || termoEndereco.includes(localidade));
          const correspondeAoGps = coordenadas
            && this.distanciaEmMetros(coordenadas, registro) <= 500;

          return correspondeAoBairro || correspondeAoGps;
        });

        if (encontrados.length > 0) {
          const localidade = encontrados[0].localidade || encontrados[0].bairro;
          return {
            encontrada: true,
            titulo: `Atenção: área de risco registrada em ${localidade}`,
            mensagem: `${encontrados.length} ponto(s) de risco constam na base oficial para esta localização. Em risco imediato, afaste-se de encostas e áreas alagadas e ligue 0800 081 3400.`,
            registros: encontrados.length
          };
        }

        return {
          encontrada: false,
          titulo: 'Consulta de risco localizada',
          mensagem: 'Não há registro correspondente nesta base regional. Isso não confirma que o local seja seguro; em emergência, ligue 0800 081 3400.',
          registros: 0
        };
      })
    );
  }

  buscarAvisoMeteorologico(endereco: string, coordenadas?: { lat: number; lng: number }): Observable<AvisoMeteorologico> {
    const localidadeInformada = endereco.trim() || 'Recife, Recife';
    const busca = coordenadas
      ? new Observable<ResultadoGeocodificacao>(subscriber => {
          subscriber.next({
            name: localidadeInformada,
            latitude: coordenadas.lat,
            longitude: coordenadas.lng
          });
          subscriber.complete();
        })
      : this.http.get<RespostaGeocodificacao>(
          `${this.geocodificacaoUrl}?name=${encodeURIComponent(`${localidadeInformada}, Pernambuco, Brasil`)}&count=1&language=pt&format=json`
        ).pipe(
          map(resposta => {
            const resultado = resposta.results?.[0];
            if (resultado) {
              return resultado;
            }

            const ponto = this.obterCoordenadasMunicipio(
              this.normalizar(localidadeInformada).split(',').pop()?.trim() || 'recife'
            );
            return {
              name: localidadeInformada,
              latitude: ponto.lat,
              longitude: ponto.lng
            };
          })
        );

    return busca.pipe(
      switchMap(localizacao => {
        const params = `?latitude=${localizacao.latitude}&longitude=${localizacao.longitude}&current=precipitation,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1`;
        return this.http.get<PrevisaoMeteorologica>(`${this.climaUrl}${params}`).pipe(
          map(previsao => ({ localizacao, previsao }))
        );
      }),
      map(({ localizacao, previsao }) => {
        const probabilidade = Math.max(...(previsao.hourly?.precipitation_probability || [0]));
        const chuvaAtual = previsao.current?.precipitation || 0;
        const codigo = previsao.current?.weather_code || 0;
        const atencao = probabilidade >= 60 || chuvaAtual >= 5 || [95, 96, 99].includes(codigo);

        return {
          nivel: atencao ? 'atencao' : 'normal',
          titulo: atencao ? `Atenção meteorológica para ${localizacao.name}` : `Condição meteorológica para ${localizacao.name}`,
          mensagem: atencao
            ? `Há previsão de chuva ou condição adversa nas próximas horas (probabilidade máxima de ${probabilidade}%). Em risco, procure um local seguro e ligue 0800 081 3400.`
            : `Não há previsão de condição meteorológica severa nas próximas horas (probabilidade máxima de ${probabilidade}%). Isso não substitui os alertas oficiais.`
        };
      })
    );
  }

  private normalizar(valor: string): string {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  }

  private obterCoordenadasMunicipio(municipio: string): { lat: number; lng: number } {
    const coordenadas: Record<string, { lat: number; lng: number }> = {
      recife: { lat: -8.0476, lng: -34.8770 },
      olinda: { lat: -8.0089, lng: -34.8553 },
      'jaboatao dos guararapes': { lat: -8.1128, lng: -35.0147 },
      paulista: { lat: -7.9408, lng: -34.8731 },
      camaragibe: { lat: -8.0214, lng: -34.9811 },
      cabo: { lat: -8.2839, lng: -35.0333 },
      'sao lourenco da mata': { lat: -7.9959, lng: -35.0183 },
      igarassu: { lat: -7.8342, lng: -34.9064 },
      itamaraca: { lat: -7.7478, lng: -34.8256 },
      abreu: { lat: -7.9022, lng: -34.9028 },
      'moreno': { lat: -8.1186, lng: -35.0922 },
      itapissuma: { lat: -7.7769, lng: -34.8922 },
      aracoiaba: { lat: -7.7908, lng: -35.0909 }
    };

    return coordenadas[municipio] || coordenadas['recife'];
  }

  private distanciaEmMetros(
    origem: { lat: number; lng: number },
    destino: { latitude: number; longitude: number }
  ): number {
    const latitudeEmMetros = (origem.lat - destino.latitude) * 111_000;
    const longitudeEmMetros = (origem.lng - destino.longitude) * 111_000;
    return Math.sqrt(latitudeEmMetros ** 2 + longitudeEmMetros ** 2);
  }
}
