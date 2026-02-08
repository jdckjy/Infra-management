
import React from 'react';
import { TeamMember } from '../types';
import { Edit, Trash, X } from 'lucide-react';

interface MemberActionModalProps {
  member: TeamMember;
  onClose: () => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (memberId: string) => void;
}

const MemberActionModal: React.FC<MemberActionModalProps> = ({ member, onClose, onEdit, onDelete }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-xs m-4 text-center" onClick={e => e.stopPropagation()}>
        <div className="flex justify-end -mr-4 -mt-4">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2">
            <X size={20} />
          </button>
        </div>
        
        <img src={member.avatarUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
        <h2 className="text-2xl font-bold mb-1 text-gray-800">{member.name}</h2>
        <p className="text-gray-500 mb-8">{member.role}</p>

        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => onEdit(member)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <Edit size={16} />
            <span>팀원 정보 수정</span>
          </button>
          <button 
            onClick={() => onDelete(member.id)}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
          >
            <Trash size={16} />
            <span>팀원 삭제</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberActionModal;
