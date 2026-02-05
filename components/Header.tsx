
import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Database, Plus } from 'lucide-react';
import { TeamMember } from '../types';
import TeamMemberModal from './NewTeamMemberModal';

const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Armin A.',
    role: 'Project Manager',
    avatarUrl: 'https://i.pravatar.cc/100?u=Armin A.',
  },
  {
    id: '2',
    name: 'Eren Y.',
    role: 'Lead Engineer',
    avatarUrl: 'https://i.pravatar.cc/100?u=Eren Y.',
  },
    {
    id: '3',
    name: 'Mikasa A.',
    role: 'Designer',
    avatarUrl: 'https://i.pravatar.cc/100?u=Mikasa A.',
  },
];

const Header: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleSaveMember = (memberData: Omit<TeamMember, 'id'> & { id?: string }) => {
    if (memberData.id) {
      // Editing existing member
      setTeamMembers(teamMembers.map(m => m.id === memberData.id ? { ...m, ...memberData } : m));
    } else {
      // Adding new member
      const newId = (teamMembers.length + 1).toString();
      setTeamMembers([...teamMembers, { ...memberData, id: newId, avatarUrl: memberData.avatarUrl || '' }]);
    }
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleDeleteMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const openModalForEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const openModalForAdd = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  return (
    <header className="flex items-center justify-between py-4 px-2">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
          <input 
            type="text" 
            placeholder='"인사이트"를 검색해 보세요' 
            className="pl-12 pr-6 py-2.5 bg-white border border-transparent rounded-full text-sm w-96 outline-none shadow-sm focus:border-gray-200 transition-all font-medium text-gray-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {teamMembers.map((member) => (
            <div key={member.id} onClick={() => openModalForEdit(member)} className="w-8 h-8 rounded-full border-2 border-[#F8F7F4] bg-white flex items-center justify-center overflow-hidden shadow-sm hover:z-10 transition-all cursor-pointer">
              <img src={member.avatarUrl} alt={member.name} title={`${member.name} (${member.role})`} className="w-full h-full object-cover" />
            </div>
          ))}
          <div 
            onClick={openModalForAdd}
            className="w-8 h-8 rounded-full border-2 border-[#F8F7F4] bg-white flex items-center justify-center text-gray-400 shadow-sm cursor-pointer hover:bg-gray-50">
            <Plus size={14} />
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-2"></div>
        
        <button className="p-2.5 bg-white text-gray-500 rounded-full shadow-sm hover:shadow-md transition-all relative">
          <Database size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pink-500 rounded-full border-2 border-white"></span>
        </button>

        <button className="p-2.5 bg-white text-gray-500 rounded-full shadow-sm hover:shadow-md transition-all">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
            C
          </div>
          <ChevronDown size={14} className="text-gray-400 group-hover:text-black transition-colors" />
        </div>
      </div>
      {isModalOpen && (
        <TeamMemberModal
          onClose={() => { setIsModalOpen(false); setSelectedMember(null); }}
          onSave={handleSaveMember}
          onDelete={handleDeleteMember}
          member={selectedMember}
        />
      )}
    </header>
  );
};

export default Header;
