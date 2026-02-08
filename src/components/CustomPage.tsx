
import React, { useState } from 'react';
import { Asterisk, Plus, Pencil, Trash2 } from 'lucide-react';
import { Facility, StateUpdater } from '../types';

interface CustomPageProps {
  title: string;
  facilities?: Facility[];
  setFacilities?: StateUpdater<Facility[]>;
}

const FacilityModal: React.FC<{ facility: Partial<Facility> | null; onSave: (facility: Facility) => void; onClose: () => void; }> = ({ facility, onSave, onClose }) => {
  if (!facility) return null;

  const [formData, setFormData] = useState(facility);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Facility);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{formData.id ? '시설 수정' : '새 시설 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="category" value={formData.category || ''} onChange={handleChange} placeholder="구분" className="p-2 border rounded" />
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="세부시설명" className="p-2 border rounded" />
            <input type="number" name="area" value={formData.area || ''} onChange={handleChange} placeholder="시설면적(m²)" className="p-2 border rounded" />
            <input type="number" name="buildingArea" value={formData.buildingArea || ''} onChange={handleChange} placeholder="건축면적(m²)" className="p-2 border rounded" />
            <input type="number" name="bcr" value={formData.bcr || ''} onChange={handleChange} placeholder="건폐율(%)" className="p-2 border rounded" />
            <input type="number" name="gfa" value={formData.gfa || ''} onChange={handleChange} placeholder="지상총면적(m²)" className="p-2 border rounded" />
            <input type="number" name="far" value={formData.far || ''} onChange={handleChange} placeholder="용적률(%)" className="p-2 border rounded" />
            <input type="text" name="usage" value={formData.usage || ''} onChange={handleChange} placeholder="건축물용도" className="p-2 border rounded" />
            <input type="text" name="height" value={formData.height || ''} onChange={handleChange} placeholder="높이" className="p-2 border rounded" />
            <input type="text" name="notes" value={formData.notes || ''} onChange={handleChange} placeholder="비고" className="p-2 border rounded col-span-2" />
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">취소</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomPage: React.FC<CustomPageProps> = ({ title, facilities, setFacilities }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFacility, setCurrentFacility] = useState<Partial<Facility> | null>(null);

  const handleAddNew = () => {
    setCurrentFacility({ id: `facility-${Date.now()}` });
    setIsModalOpen(true);
  };

  const handleEdit = (facility: Facility) => {
    setCurrentFacility(facility);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 시설을 삭제하시겠습니까?') && setFacilities) {
      setFacilities(prev => prev!.filter(f => f.id !== id));
    }
  };

  const handleSave = (facility: Facility) => {
    if (setFacilities) {
      setFacilities(prev => {
        const existing = prev!.find(f => f.id === facility.id);
        if (existing) {
          return prev!.map(f => (f.id === facility.id ? facility : f));
        } else {
          return [...prev!, facility];
        }
      });
    }
    setIsModalOpen(false);
    setCurrentFacility(null);
  };

  const renderFacilitiesTable = () => {
    if (!facilities || !setFacilities) return null;

    const tableHeaders = ['구분', '세부시설명', '시설면적(m²)', '건축면적(m²)', '건폐율(%)', '용적률(%)', '용도', '높이', '조치'];

    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">시설 목록</h2>
            <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                <Plus size={16} className="mr-2" />
                시설 추가
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>{tableHeaders.map(h => <th key={h} className="px-6 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {facilities.map((facility) => (
                <tr key={facility.id} className="bg-white border-b">
                  <td className="px-6 py-4">{facility.category}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{facility.name}</td>
                  <td className="px-6 py-4">{facility.area?.toLocaleString()}</td>
                  <td className="px-6 py-4">{facility.buildingArea?.toLocaleString()}</td>
                  <td className="px-6 py-4">{facility.bcr}</td>
                  <td className="px-6 py-4">{facility.far}</td>
                  <td className="px-6 py-4">{facility.usage}</td>
                  <td className="px-6 py-4">{facility.height}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleEdit(facility)} className="text-blue-600"><Pencil size={18} /></button>
                    <button onClick={() => handleDelete(facility.id)} className="text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gray-800 text-white rounded-full p-3 flex-shrink-0">
          <Asterisk size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">안녕하세요, {title}</h1>
          <p className="text-gray-500 mt-1">지난 30일 동안의 {title}에 대한 간략한 개요입니다.</p>
        </div>
      </div>
      {facilities ? renderFacilitiesTable() : (
        <div className="bg-white rounded-2xl p-6">
           <p className="text-gray-500">이 페이지의 컨텐츠를 추가하세요.</p>
        </div>
      )}
      {isModalOpen && <FacilityModal facility={currentFacility} onSave={handleSave} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default CustomPage;
