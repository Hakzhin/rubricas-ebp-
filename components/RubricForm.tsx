import React, { useState, useEffect } from 'react';
import { ETAPAS_EDUCATIVAS, CURSOS_POR_ETAPA, ASIGNATURAS_POR_ETAPA } from '../constants';
import type { FormData, WeightedCriterion } from '../types';

interface RubricFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const RubricForm: React.FC<RubricFormProps> = ({ onSubmit, isLoading }) => {
  const [stage, setStage] = useState<string>('');
  const [course, setCourse] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [evaluationElement, setEvaluationElement] = useState<string>('');
  const [performanceLevels, setPerformanceLevels] = useState<string[]>(['Excelente', 'Notable', 'Suficiente', 'Insuficiente']);
  const [specificCriteria, setSpecificCriteria] = useState<string[]>(['']);
  const [evaluationCriteria, setEvaluationCriteria] = useState<WeightedCriterion[]>([
    { name: '', weight: 0 }
  ]);

  // Resetear curso y asignatura cuando cambia la etapa
  useEffect(() => {
    setCourse('');
    setSubject('');
  }, [stage]);

  const handleAddPerformanceLevel = () => {
    setPerformanceLevels([...performanceLevels, '']);
  };

  const handleRemovePerformanceLevel = (index: number) => {
    if (performanceLevels.length > 2) {
      setPerformanceLevels(performanceLevels.filter((_, i) => i !== index));
    }
  };

  const handlePerformanceLevelChange = (index: number, value: string) => {
    const newLevels = [...performanceLevels];
    newLevels[index] = value;
    setPerformanceLevels(newLevels);
  };

  const handleAddSpecificCriterion = () => {
    setSpecificCriteria([...specificCriteria, '']);
  };

  const handleRemoveSpecificCriterion = (index: number) => {
    if (specificCriteria.length > 1) {
      setSpecificCriteria(specificCriteria.filter((_, i) => i !== index));
    }
  };

  const handleSpecificCriterionChange = (index: number, value: string) => {
    const newCriteria = [...specificCriteria];
    newCriteria[index] = value;
    setSpecificCriteria(newCriteria);
  };

  const handleAddEvaluationCriterion = () => {
    setEvaluationCriteria([...evaluationCriteria, { name: '', weight: 0 }]);
  };

  const handleRemoveEvaluationCriterion = (index: number) => {
    if (evaluationCriteria.length > 1) {
      setEvaluationCriteria(evaluationCriteria.filter((_, i) => i !== index));
    }
  };

  const handleEvaluationCriterionChange = (index: number, field: 'name' | 'weight', value: string | number) => {
    const newCriteria = [...evaluationCriteria];
    if (field === 'weight') {
      newCriteria[index].weight = typeof value === 'number' ? value : parseFloat(value) || 0;
    } else {
      newCriteria[index].name = value as string;
    }
    setEvaluationCriteria(newCriteria);
  };

  const getTotalWeight = (): number => {
    return evaluationCriteria.reduce((sum, criterion) => sum + (criterion.weight || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!stage || !course || !subject || !evaluationElement) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    const totalWeight = getTotalWeight();
    if (Math.abs(totalWeight - 100) > 0.1) {
      alert(`La suma de los pesos debe ser 100%. Actualmente es: ${totalWeight.toFixed(1)}%`);
      return;
    }

    // Filtrar criterios vacíos
    const filteredPerformanceLevels = performanceLevels.filter(level => level.trim() !== '');
    const filteredSpecificCriteria = specificCriteria.filter(criterion => criterion.trim() !== '');
    const filteredEvaluationCriteria = evaluationCriteria.filter(
      criterion => criterion.name.trim() !== '' && criterion.weight > 0
    );

    if (filteredPerformanceLevels.length < 2) {
      alert('Debe haber al menos 2 niveles de desempeño');
      return;
    }

    if (filteredEvaluationCriteria.length === 0) {
      alert('Debe haber al menos un criterio de evaluación');
      return;
    }

    const formData: FormData = {
      stage,
      course,
      subject,
      evaluationElement,
      performanceLevels: filteredPerformanceLevels,
      specificCriteria: filteredSpecificCriteria,
      evaluationCriteria: filteredEvaluationCriteria
    };

    onSubmit(formData);
  };

  const totalWeight = getTotalWeight();
  const isWeightValid = Math.abs(totalWeight - 100) < 0.1;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Configuración de la Rúbrica</h2>
      
      <div className="space-y-6">
        {/* Etapa Educativa */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Etapa Educativa <span className="text-red-500">*</span>
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="">Selecciona una etapa</option>
            {ETAPAS_EDUCATIVAS.map(etapa => (
              <option key={etapa.value} value={etapa.value}>{etapa.label}</option>
            ))}
          </select>
        </div>

        {/* Curso */}
        {stage && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Curso <span className="text-red-500">*</span>
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">Selecciona un curso</option>
              {CURSOS_POR_ETAPA[stage]?.map(curso => (
                <option key={curso.value} value={curso.value}>{curso.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Asignatura */}
        {stage && (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Asignatura <span className="text-red-500">*</span>
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            >
              <option value="">Selecciona una asignatura</option>
              {ASIGNATURAS_POR_ETAPA[stage]?.map(asignatura => (
                <option key={asignatura.value} value={asignatura.value}>{asignatura.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Elemento de Evaluación */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Elemento a Evaluar <span className="text-red-500">*</span>
          </label>
          <textarea
            value={evaluationElement}
            onChange={(e) => setEvaluationElement(e.target.value)}
            placeholder="Ej: Trabajo de investigación sobre el sistema solar"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
            disabled={isLoading}
          />
        </div>

        {/* Niveles de Desempeño */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Niveles de Desempeño
          </label>
          <div className="space-y-2">
            {performanceLevels.map((level, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={level}
                  onChange={(e) => handlePerformanceLevelChange(index, e.target.value)}
                  placeholder={`Nivel ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                {performanceLevels.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePerformanceLevel(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddPerformanceLevel}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            + Añadir Nivel
          </button>
        </div>

        {/* Criterios Específicos */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Criterios Específicos (Opcional)
          </label>
          <div className="space-y-2">
            {specificCriteria.map((criterion, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={criterion}
                  onChange={(e) => handleSpecificCriterionChange(index, e.target.value)}
                  placeholder="Ej: Uso correcto de fuentes bibliográficas"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                {specificCriteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecificCriterion(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddSpecificCriterion}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            + Añadir Criterio
          </button>
        </div>

        {/* Criterios de Evaluación Ponderados */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Criterios de Evaluación (con ponderación)
          </label>
          <div className="space-y-2">
            {evaluationCriteria.map((criterion, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={criterion.name}
                  onChange={(e) => handleEvaluationCriterionChange(index, 'name', e.target.value)}
                  placeholder="Nombre del criterio"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                <input
                  type="number"
                  value={criterion.weight || ''}
                  onChange={(e) => handleEvaluationCriterionChange(index, 'weight', e.target.value)}
                  placeholder="%"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-24 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                {evaluationCriteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEvaluationCriterion(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={isLoading}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={handleAddEvaluationCriterion}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={isLoading}
            >
              + Añadir Criterio
            </button>
            <div className={`text-sm font-semibold ${isWeightValid ? 'text-green-600' : 'text-red-600'}`}>
              Total: {totalWeight.toFixed(1)}% {isWeightValid ? '✓' : '(debe ser 100%)'}
            </div>
          </div>
        </div>

        {/* Botón de Generar */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !isWeightValid}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? 'Generando...' : 'Generar Rúbrica con IA'}
        </button>
      </div>
    </div>
  );
};
