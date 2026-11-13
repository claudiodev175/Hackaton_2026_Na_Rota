import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

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
  private readonly climaUrl = 'https://api.open-meteo.com/v1/forecast';
  private readonly geocodificacaoUrl = 'https://geocoding-api.open-meteo.com/v1/search';

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

}
