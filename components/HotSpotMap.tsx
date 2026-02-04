
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Crosshair, Navigation, Activity } from 'lucide-react';
import L from 'leaflet';

// severity에 따른 색상 및 펄스 효과 설정
const severityConfig = {
  Low: { color: 'bg-indigo-500', pulse: false, name: '안전' },
  Medium: { color: 'bg-amber-500', pulse: false, name: '주의' },
  High: { color: 'bg-red-500', pulse: true, name: '위험' },
};

// HTML/CSS 기반의 커스텀 마커 아이콘 생성 함수
const createCustomDivIcon = (severity: 'Low' | 'Medium' | 'High') => {
  const config = severityConfig[severity];
  
  // High severity일 때만 ping 애니메이션을 위한 HTML 추가
  const pulseHtml = config.pulse
    ? '<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>'
    : '';

  return L.divIcon({
    html: `
      <div class="relative flex justify-center items-center w-6 h-6">
        ${pulseHtml}
        <span class="relative inline-flex rounded-full h-4 w-4 ${config.color} border-2 border-white shadow-md"></span>
      </div>
    `,
    className: '', // Leaflet의 기본 스타일을 적용하지 않기 위해 빈 문자열 설정
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Shift + Wheel로 줌을 제어하는 컴포넌트
const TacticalZoom = () => {
  const map = useMap();

  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (e.shiftKey) {
        e.preventDefault();
        const zoom = map.getZoom() + e.deltaY * -0.01;
        map.setZoom(zoom);
      }
    };
    
    const mapContainer = map.getContainer();
    // passive: false로 설정하여 preventDefault가 동작하도록 함
    mapContainer.addEventListener('wheel', handler, { passive: false });

    return () => {
      mapContainer.removeEventListener('wheel', handler);
    };
  }, [map]);

  return null;
};

// 지도 이벤트를 처리하는 컴포넌트
const MapEvents = ({ onMouseMove }: { onMouseMove: (e: any) => void }) => {
  useMapEvents({
    mousemove: onMouseMove,
  });
  return null;
};

interface HotSpot {
  id: number;
  position: LatLngExpression;
  severity: 'Low' | 'Medium' | 'High';
  title: string;
  active: boolean;
}

const HotSpotMap = () => {
  const [viewMode, setViewMode] = useState<'satellite' | 'blueprint'>('satellite');
  const [mouseCoords, setMouseCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newSpotCoords, setNewSpotCoords] = useState<null | { lat: number, lng: number }>(null);
  const mapRef = useRef<Map>(null);

  const initialPosition: LatLngExpression = [33.298, 126.541];

  const hotspots: HotSpot[] = [
    { id: 1, position: [33.299, 126.542], severity: 'High', title: '연구동 A: 누수 감지', active: true },
    { id: 2, position: [33.297, 126.540], severity: 'Medium', title: '산책로 보도블럭 파손', active: false },
    { id: 3, position: [33.2985, 126.543], severity: 'Low', title: '정문 CCTV 점검 필요', active: false },
  ];

  const handleAddRiskClick = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      setNewSpotCoords(center);
      setShowModal(true);
    }
  };

  const handleMouseMove = (e: any) => {
    setMouseCoords(e.latlng);
  };

  return (
    <div className="relative w-full h-full bg-black text-white rounded-3xl overflow-hidden">
      <MapContainer ref={mapRef} center={initialPosition} zoom={15.5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        {viewMode === 'satellite' ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            className="leaflet-tile-blueprint"
          />
        )}
        
        {hotspots.map(spot => (
          <Marker 
            key={spot.id} 
            position={spot.position} 
            icon={createCustomDivIcon(spot.severity)}
          >
            <Popup>
              <div className="bg-slate-800 text-white p-3 rounded-lg shadow-lg border border-slate-700">
                <p className="font-bold text-base mb-1">{spot.title}</p>
                <p className={`text-sm font-bold ${severityConfig[spot.severity].color.replace('bg-', 'text-')}`}>위험도: {severityConfig[spot.severity].name}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <TacticalZoom />
        <MapEvents onMouseMove={handleMouseMove} />
      </MapContainer>

      {/* 상단 좌측 HUD */}
      <div className="absolute top-6 left-6 z-[1000] flex items-center gap-4">
        <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl rounded-xl p-3 px-4 border border-white/20">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wider uppercase">Tactical View</h2>
            <p className="text-xs text-gray-400 font-bold">SATELLITE LIVE</p>
          </div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-full border border-white/20 flex">
           <button onClick={() => setViewMode('satellite')} className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'satellite' ? 'bg-blue-500/80 text-white' : 'text-gray-400 hover:text-white'}`}>Satellite</button>
           <button onClick={() => setViewMode('blueprint')} className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${viewMode === 'blueprint' ? 'bg-blue-500/80 text-white' : 'text-gray-400 hover:text-white'}`}>Blueprint</button>
        </div>
      </div>
      
      {/* 상단 우측 HUD */}
      <div className="absolute top-6 right-6 z-[1000] flex items-center gap-4">
        <div className="bg-slate-900/80 backdrop-blur-xl p-3 rounded-xl border border-white/20 text-xs flex items-center gap-6">
            <div className="flex items-center gap-2"><Crosshair size={14} /><span>X: {mouseCoords?.lng.toFixed(4)}, Y: {mouseCoords?.lat.toFixed(4)}</span></div>
            <div className="flex items-center gap-2"><Navigation size={14} /><span>ZOOM: {mapRef.current?.getZoom().toFixed(2)}</span></div>
            <div className="flex items-center gap-2"><Activity size={14} /><span>STATUS: OPERATIONAL</span></div>
        </div>
        <button onClick={handleAddRiskClick} className="bg-white/90 backdrop-blur-md text-gray-800 font-bold text-xs px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 pointer-events-auto hover:bg-white transition-all">
          <Plus size={14} />
          <span>위험 등록</span>
        </button>
      </div>

      {/* 하단 우측 플로팅 버튼 */}
      <div className="absolute bottom-6 right-6 z-[1000]">
        <button onClick={handleAddRiskClick} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-red-600 transition-colors duration-300">
          <Plus size={24} />
        </button>
      </div>

      {/* 위험 등록 모달 */}
      {showModal && newSpotCoords && (
        <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-96 border border-gray-600">
            <h3 className="text-xl font-bold mb-4">New Risk Log</h3>
            <p className="text-sm mb-2">Coordinates (Map Center):</p>
            <div className="bg-gray-900 p-2 rounded-md text-sm mb-4">
              Lat: {newSpotCoords?.lat.toFixed(6)}, Lng: {newSpotCoords?.lng.toFixed(6)}
            </div>
            <label className="block text-sm font-semibold mb-2 mt-4">Title</label>
            <input type="text" className="w-full bg-gray-700 p-2 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Main Gate CCTV Check" />
            <label className="block text-sm font-semibold mb-2">Severity</label>
            <select className="w-full bg-gray-700 p-2 rounded-md mb-6 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition-colors">Cancel</button>
              <button className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors">Save Log</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Blueprint 모드용 CSS 필터 */}
      <style>{`
        .leaflet-tile-blueprint {
          filter: invert(1) grayscale(1) brightness(0.8) contrast(1.2);
        }
      `}</style>
    </div>
  );
};

export default HotSpotMap;
