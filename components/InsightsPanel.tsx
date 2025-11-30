'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface InsightsSummary {
  total_sessions: number;
  most_frequent_themes: Array<{
    name: string;
    frequency: number;
    avg_relevance: number;
  }>;
  dominant_psychological_patterns: Array<{
    element_name: string;
    element_type: string;
    occurrences: number;
    avg_confidence: number;
  }>;
  ocean_trends: Array<{
    trait: string;
    current_avg: number;
    previous_avg: number;
    change: number;
  }>;
  recent_patterns: string[];
}

interface GeneralStats {
  total_sessions: number;
  avg_duration: number;
  total_duration: number;
  first_session: string;
  last_session: string;
  unique_themes: number;
}

interface OceanEvolution {
  date: string;
  openness: number | null;
  conscientiousness: number | null;
  extraversion: number | null;
  agreeableness: number | null;
  neuroticism: number | null;
}

export default function InsightsPanel() {
  const [insights, setInsights] = useState<InsightsSummary | null>(null);
  const [stats, setStats] = useState<GeneralStats | null>(null);
  const [oceanEvolution, setOceanEvolution] = useState<OceanEvolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    loadInsights();
  }, [days]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      
      const [insightsRes, statsRes, evolutionRes] = await Promise.all([
        fetch(`/api/insights?type=summary&days=${days}`),
        fetch('/api/insights?type=stats'),
        fetch(`/api/insights?type=evolution&days=${days}`)
      ]);

      const insightsData = await insightsRes.json();
      const statsData = await statsRes.json();
      const evolutionData = await evolutionRes.json();

      if (insightsData.success) {
        setInsights(insightsData.data);
      }
      
      if (statsData.success) {
        setStats(statsData.data);
      }

      if (evolutionData.success) {
        setOceanEvolution(evolutionData.data);
      }
    } catch (error) {
      console.error('Erro ao carregar insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTraitName = (trait: string): string => {
    const names: Record<string, string> = {
      openness: 'Abertura',
      conscientiousness: 'Conscienciosidade',
      extraversion: 'Extroversão',
      agreeableness: 'Amabilidade',
      neuroticism: 'Neuroticismo'
    };
    return names[trait] || trait;
  };

  const getElementTypeName = (type: string): string => {
    const names: Record<string, string> = {
      cognitive_bias: 'Viés Cognitivo',
      defense_mechanism: 'Mecanismo de Defesa',
      attachment_pattern: 'Padrão de Apego',
      emotional_regulation: 'Regulação Emocional'
    };
    return names[type] || type;
  };

  const formatElementName = (name: string): string => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short'
    }).format(date);
  };

  // Preparar dados para o gráfico de radar OCEAN
  const getRadarData = () => {
    if (!insights?.ocean_trends || insights.ocean_trends.length === 0) return [];
    
    return insights.ocean_trends
      .filter(trend => trend.current_avg > 0)
      .map(trend => ({
        trait: getTraitName(trend.trait),
        value: Math.round(trend.current_avg * 10) / 10,
        fullMark: 10
      }));
  };

  // Cores para os traços OCEAN
  const traitColors: Record<string, string> = {
    openness: '#8B5CF6',
    conscientiousness: '#3B82F6',
    extraversion: '#10B981',
    agreeableness: '#F59E0B',
    neuroticism: '#EF4444'
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6'];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-700 dark:text-gray-300">Carregando insights...</span>
        </div>
      </div>
    );
  }

  if (!insights || !stats) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Dados insuficientes para gerar insights. Grave mais reflexões!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtro de Período */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Análise de Padrões
        </h2>
        <div className="flex gap-4">
          {[7, 30, 90, 365].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                days === d
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {d === 365 ? '1 Ano' : `${d} Dias`}
            </button>
          ))}
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📈 Estatísticas Gerais
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total de Sessões</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.total_sessions}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Temas Únicos</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.unique_themes}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tempo Total</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(stats.total_duration / 60)} min
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Média/Sessão</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(stats.avg_duration / 60)} min
            </p>
          </div>
        </div>
      </div>

      {/* Padrões Recentes */}
      {insights.recent_patterns.length > 0 && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-4">🔍 Padrões Identificados</h3>
          <ul className="space-y-2">
            {insights.recent_patterns.map((pattern, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-yellow-300 mr-2">▸</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tendências OCEAN */}
      {insights.ocean_trends.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            🧠 Perfil OCEAN Atual
          </h3>
          
          {/* Gráfico de Radar */}
          <div className="mb-8">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={getRadarData()}>
                <PolarGrid stroke="#6B7280" />
                <PolarAngleAxis 
                  dataKey="trait" 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 10]}
                  tick={{ fill: '#6B7280' }}
                />
                <Radar
                  name="Score Atual"
                  dataKey="value"
                  stroke="#8B5CF6"
                  fill="#8B5CF6"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Barras de Tendência com Mudanças */}
          <div className="space-y-3">
            {insights.ocean_trends
              .filter(trend => trend.current_avg > 0)
              .map(trend => (
                <div key={trend.trait} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {getTraitName(trend.trait)}
                      </span>
                      <span className={`text-sm font-bold ${
                        trend.change > 0.5 ? 'text-red-600' :
                        trend.change < -0.5 ? 'text-green-600' :
                        'text-gray-600'
                      }`}>
                        {trend.change > 0 ? '↑' : trend.change < 0 ? '↓' : '→'} 
                        {Math.abs(trend.change).toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all"
                        style={{ 
                          width: `${(trend.current_avg / 10) * 100}%`,
                          backgroundColor: traitColors[trend.trait as keyof typeof traitColors]
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Atual: {trend.current_avg.toFixed(1)}/10 | Anterior: {trend.previous_avg.toFixed(1)}/10
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Evolução Temporal OCEAN */}
      {oceanEvolution.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            📈 Evolução Temporal - Últimos {days} Dias
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={oceanEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 11 }}
              />
              <YAxis 
                domain={[0, 10]}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                labelFormatter={(label) => `Data: ${formatDate(label)}`}
              />
              <Legend 
                wrapperStyle={{ color: '#9CA3AF' }}
              />
              {insights.ocean_trends
                .filter(trend => trend.current_avg > 0)
                .map(trend => (
                  <Line
                    key={trend.trait}
                    type="monotone"
                    dataKey={trend.trait}
                    stroke={traitColors[trend.trait as keyof typeof traitColors]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name={getTraitName(trend.trait)}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Temas Mais Frequentes - Gráfico de Barras */}
      {insights.most_frequent_themes.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🏷️ Temas Recorrentes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={insights.most_frequent_themes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
              />
              <Bar dataKey="frequency" fill="#8B5CF6" radius={[8, 8, 0, 0]}>
                {insights.most_frequent_themes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Padrões Psicológicos Dominantes */}
      {insights.dominant_psychological_patterns.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🧩 Padrões Psicológicos Identificados
          </h3>
          
          {/* Gráfico de Barras Horizontais */}
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart 
                data={insights.dominant_psychological_patterns.slice(0, 5)}
                layout="vertical"
                margin={{ left: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  type="number"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  type="category"
                  dataKey="element_name"
                  stroke="#6B7280"
                  tick={{ fill: '#6B7280', fontSize: 11 }}
                  width={90}
                  tickFormatter={(value) => {
                    const formatted = formatElementName(value);
                    return formatted.length > 15 ? formatted.substring(0, 15) + '...' : formatted;
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value} ocorrências`,
                    formatElementName(props.payload.element_name)
                  ]}
                />
                <Bar dataKey="occurrences" fill="#EC4899" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detalhes dos Padrões */}
          <div className="space-y-3">
            {insights.dominant_psychological_patterns.map((pattern, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatElementName(pattern.element_name)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getElementTypeName(pattern.element_type)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {pattern.occurrences}x
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(pattern.avg_confidence * 100).toFixed(0)}% confiança
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
