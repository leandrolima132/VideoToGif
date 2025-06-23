
import React from "react";

export const FeaturesSection: React.FC = () => {
  return (
    <div className="mt-12 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
        ✨ Recursos Principais
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-semibold text-gray-800 mb-2">Conversão Rápida</h3>
          <p className="text-sm text-gray-600">
            Processamento otimizado com FFmpeg para resultados em segundos
          </p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="font-semibold text-gray-800 mb-2">Controle Total</h3>
          <p className="text-sm text-gray-600">
            Ajuste velocidade, qualidade e tamanho conforme sua necessidade
          </p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-semibold text-gray-800 mb-2">100% Seguro</h3>
          <p className="text-sm text-gray-600">
            Processamento local no seu navegador, sem upload para servidores
          </p>
        </div>
      </div>
    </div>
  );
};
