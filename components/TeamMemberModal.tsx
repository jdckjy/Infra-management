
import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';

interface TeamMemberModalProps {
  onClose: () => void;
  onSave: (memberData: Omit<TeamMember, 'id'> & { id?: string }) => void;
  onDelete?: (memberId: string) => void;
  member: TeamMember | null;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ onClose, onSave, onDelete, member }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const isEditing = member !== null;

  useEffect(() => {
    if (isEditing) {
      setName(member.name);
      setRole(member.role);
      setAvatarPreview(member.avatarUrl);
    } else {
      setName('');
      setRole('');
      setAvatarPreview(null);
    }
  }, [member, isEditing]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && role) {
      const memberData = {
        id: isEditing ? member.id : undefined,
        name,
        role,
        avatarUrl: avatarPreview!,
      };
      onSave(memberData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (isEditing && onDelete) {
      onDelete(member.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isEditing ? '팀원 정보 수정' : '새 팀원 추가'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">직책</label>
            <input
              type="text"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">프로필 사진</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.993A1 1 0 001 18.007v-3.003A1 1 0 000 13.003V10.003A1 1 0 001 9.003V6.003A1 1 0 000 5.003V2.003A1 1 0 001 1.003h1.993A1 1 0 004 0h16a1 1 0 001-1.003V2.003a1 1 0 001-1.003v2.994a1 1 0 00-1 1.003v3.004a1 1 0 001 1.003v2.994a1 1 0 00-1 1.003v3.003a1 1 0 001 1.003z" />
                  </svg>
                )}
              </span>
              <label
                htmlFor="avatar-upload"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                <span>파일 업로드</span>
                <input id="avatar-upload" name="avatar-upload" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
              </label>
            </div>
          </div>
          <div className="flex justify-between items-center mt-6">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  삭제
                </button>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEditing ? '저장' : '추가'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Rename the component to avoid confusion with the old one
export default TeamMemberModal;
