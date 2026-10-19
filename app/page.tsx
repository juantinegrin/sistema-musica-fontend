"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Calendar, Clock, Music, MapPin, User, AlertCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Schedule {
  id: string;
  teacher_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  is_replacement: boolean;
  notes?: string | null;
  enrollment_id?: string | null;
}

export default function AgendaPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchSchedules() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Schedule[]>("/schedules/");
      setSchedules(response.data);
    } catch (err) {
      console.error("Erro ao buscar grade de aulas:", err);
      setError("Não foi possível carregar as aulas. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-sm">
                <Music className="w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                Gestão da Escola de Música
              </h1>
            </div>
            <p className="text-slate-500 text-sm mt-1 ml-1">
              Grade de aulas, salas e reposições agendadas
            </p>
          </div>

          <button
            onClick={fetchSchedules}
            disabled={loading}
            className="flex items-center gap-2 self-start md:self-auto px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium text-slate-700 shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </header>

        {/* Mensagem de Erro se houver */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Conteúdo Principal */}
        <main>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" /> Aulas Agendadas
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
              {schedules.length} {schedules.length === 1 ? "aula" : "aulas"}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-40 bg-slate-200/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-semibold text-slate-700">Nenhuma aula na grade</h3>
              <p className="text-sm text-slate-400 mt-1">
                Cadastre novas aulas na API ou insira novos agendamentos para visualizá-los aqui.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {schedules.map((item) => {
                const startDate = new Date(item.start_time);
                const endDate = new Date(item.end_time);

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Badges de Topo */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                          {format(startDate, "EEEE", { locale: ptBR })}
                        </span>
                        {item.is_replacement && (
                          <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                            Reposição
                          </span>
                        )}
                      </div>

                      {/* Horário */}
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-2">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span>
                          {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                        </span>
                      </div>

                      {/* Sala e Professor */}
                      <div className="space-y-1 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span>Sala: <strong className="text-slate-700">{item.room_id.slice(0, 8)}...</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Prof. ID: <strong className="text-slate-700">{item.teacher_id.slice(0, 8)}...</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Observações */}
                    {item.notes && (
                      <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
                        <strong>Obs:</strong> {item.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}