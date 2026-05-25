"use client";

import React, { useRef, useState } from "react";
import { Upload, Download, Sparkles, RefreshCw, AlertCircle, Settings2, ChevronDown, ChevronUp, Camera, Smartphone, X } from "lucide-react";

interface ControlPanelProps {
  name: string;
  setName: (name: string) => void;
  statValue: string;
  setStatValue: (val: string) => void;
  team: string;
  setTeam: (team: string) => void;
  position: string;
  setPosition: (pos: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  removeBg: boolean;
  setRemoveBg: (removeBg: boolean) => void;
  isRemovingBg: boolean;
  bgProgress: number;
  onImageSelected: (file: File) => void;
  onDownload: () => void;
  hasImage: boolean;
  onResetImage: () => void;
  
  // Custom Template props
  onTemplateSelected: (file: File) => void;
  hasTemplate: boolean;
  onResetTemplate: () => void;

  // Photo adjustment sliders
  photoScale: number;
  setPhotoScale: (scale: number) => void;
  photoX: number;
  setPhotoX: (x: number) => void;
  photoY: number;
  setPhotoY: (y: number) => void;

  // Text adjustments
  nameY: number;
  setNameY: (y: number) => void;
  teamY: number;
  setTeamY: (y: number) => void;
  overallX: number;
  setOverallX: (x: number) => void;
  overallY: number;
  setOverallY: (y: number) => void;
}

const THEME_OPTIONS = [
  { id: "oficial", name: "Copa 2026 Oficial 🏆", desc: "Turquesa clássica do álbum oficial" },
  { id: "gold", name: "Rare Gold Edition 🌟", desc: "Edição especial dourada metálica" },
  { id: "platinum", name: "Platinum Legend ⚡", desc: "Prata brilhante para jogadores lendários" },
  { id: "fire", name: "Fire Fury 🔥", desc: "Vermelho e laranja de alta energia" },
  { id: "stealth", name: "Shadow Stealth 🕶️", desc: "Carbono escuro com detalhes em neon" }
];

export default function ControlPanel({
  name,
  setName,
  statValue,
  setStatValue,
  team,
  setTeam,
  position,
  setPosition,
  theme,
  setTheme,
  removeBg,
  setRemoveBg,
  isRemovingBg,
  bgProgress,
  onImageSelected,
  onDownload,
  hasImage,
  onResetImage,
  onTemplateSelected,
  hasTemplate,
  onResetTemplate,
  photoScale,
  setPhotoScale,
  photoX,
  setPhotoX,
  photoY,
  setPhotoY,
  nameY,
  setNameY,
  teamY,
  setTeamY,
  overallX,
  setOverallX,
  overallY,
  setOverallY
}: ControlPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  const handleOpenQrModal = () => {
    if (typeof window !== "undefined") {
      setQrUrl(window.location.href);
    }
    setShowQrModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onTemplateSelected(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerTemplateUpload = () => {
    templateInputRef.current?.click();
  };

  const triggerCameraUpload = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="w-full lg:w-[420px] bg-card-bg border border-card-border p-6 flex flex-col gap-6 text-foreground shadow-2xl relative max-h-[90vh] overflow-y-auto">
      <div className="flex flex-col gap-1 border-b border-card-border pb-4">
        <h2 className="text-2xl font-bold tracking-tight text-white uppercase font-display flex items-center gap-2">
          <span>Sticker Creator</span>
          <span className="text-[10px] bg-sport-green text-black px-2 py-0.5 font-bold uppercase rounded-sm">
            Copa 2026
          </span>
        </h2>
        <p className="text-xs text-gray-400">Personalize seu card de jogador profissional em tempo real.</p>
      </div>

      {/* 1. CARREGAR IMAGEM DO MOLDE (TEMPLATE BASE) */}
      <div className="flex flex-col gap-2 bg-sport-dark/30 border border-card-border/60 p-3">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center justify-between">
          <span>1. Molde / Template Base</span>
          <span className="text-[9px] text-gray-500 font-normal normal-case">(Opcional)</span>
        </label>
        
        {!hasTemplate ? (
          <button
            id="btn-upload-template"
            type="button"
            onClick={triggerTemplateUpload}
            className="flex items-center justify-center gap-2 border border-dashed border-card-border hover:border-sport-green bg-[#161B26] hover:bg-[#1C2333] py-3 px-4 transition-colors duration-200 focus:outline-none cursor-pointer text-xs font-bold text-white uppercase rounded-xs"
          >
            <Upload className="w-4 h-4 text-gray-400" />
            Carregar Molde Personalizado
          </button>
        ) : (
          <div className="flex items-center justify-between bg-[#161B26] border border-card-border p-2 text-xs">
            <span className="text-sport-green font-medium">Molde Personalizado Ativo</span>
            <button
              id="btn-reset-template"
              type="button"
              onClick={onResetTemplate}
              className="text-red-500 hover:text-red-400 font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              Restaurar
            </button>
          </div>
        )}
        
        <input
          id="template-file-input"
          type="file"
          ref={templateInputRef}
          onChange={handleTemplateChange}
          accept="image/*"
          className="hidden"
        />
        <p className="text-[9px] text-gray-500 leading-normal">
          Carregue o arquivo de molde se possuir um modelo físico com transparência ou fundo verde.
        </p>
      </div>

      {/* 2. UPLOAD DA FOTO DO JOGADOR */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
          2. Foto do Jogador
        </label>
        
        {!hasImage ? (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-upload-photo-gallery"
                type="button"
                onClick={triggerUpload}
                disabled={isRemovingBg}
                className="flex flex-col items-center justify-center border border-card-border hover:border-sport-green bg-[#161B26] hover:bg-[#1C2333] p-4 transition-all duration-200 focus:outline-none cursor-pointer group disabled:opacity-50 rounded-xs text-center min-h-[96px]"
              >
                <Upload className="w-5 h-5 text-gray-400 group-hover:text-sport-green mb-1.5 transition-colors" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Galeria</span>
                <span className="text-[9px] text-gray-400 mt-0.5">Escolher arquivo</span>
              </button>

              <button
                id="btn-upload-photo-camera"
                type="button"
                onClick={triggerCameraUpload}
                disabled={isRemovingBg}
                className="flex flex-col items-center justify-center border border-card-border hover:border-sport-green bg-[#161B26] hover:bg-[#1C2333] p-4 transition-all duration-200 focus:outline-none cursor-pointer group disabled:opacity-50 rounded-xs text-center min-h-[96px]"
              >
                <Camera className="w-5 h-5 text-gray-400 group-hover:text-sport-green mb-1.5 transition-colors" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Tirar Foto</span>
                <span className="text-[9px] text-gray-400 mt-0.5">Usar câmera</span>
              </button>
            </div>

            <button
              id="btn-upload-phone-qr"
              type="button"
              onClick={handleOpenQrModal}
              disabled={isRemovingBg}
              className="flex items-center justify-center gap-2 border border-dashed border-card-border hover:border-sport-yellow bg-[#161B26] hover:bg-[#1C2333]/80 py-3 px-4 transition-all duration-200 focus:outline-none cursor-pointer text-xs font-bold text-white uppercase rounded-xs"
            >
              <Smartphone className="w-4 h-4 text-sport-yellow" />
              <span>Enviar do Celular (QR Code)</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-[#161B26] border border-card-border">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-sport-dark flex items-center justify-center text-sport-green border border-card-border font-bold text-xs uppercase">
                IMG
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium text-white truncate">Foto Carregada</span>
                <span className="text-[10px] text-gray-400">Pronta para renderização</span>
              </div>
            </div>
            
            <button
              id="btn-reset-photo"
              type="button"
              onClick={onResetImage}
              disabled={isRemovingBg}
              className="text-xs text-red-500 hover:text-red-400 font-semibold uppercase flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Trocar
            </button>
          </div>
        )}
        
        <input
          id="photo-file-input"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <input
          id="camera-file-input"
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="user"
          className="hidden"
        />

        {/* Remoção de Fundo Inteligente */}
        <div className="mt-2 bg-[#161B26] border border-card-border p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sport-green" />
              <label htmlFor="toggle-remove-bg" className="text-xs font-bold text-white uppercase tracking-wide cursor-pointer">
                Remover Fundo IA
              </label>
            </div>
            <button
              id="toggle-remove-bg"
              type="button"
              onClick={() => setRemoveBg(!removeBg)}
              disabled={isRemovingBg}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                removeBg ? "bg-sport-green" : "bg-gray-700"
              } disabled:opacity-50`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  removeBg ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 leading-normal">
            Gera o recorte automático do seu tronco/rosto.
          </p>

          {/* Progresso de Processamento */}
          {isRemovingBg && (
            <div className="mt-1 pt-2 border-t border-card-border/50">
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-sport-green font-medium flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Recortando jogador...
                </span>
                <span className="text-white font-bold">{bgProgress}%</span>
              </div>
              <div className="w-full bg-sport-dark h-1.5 rounded-full overflow-hidden border border-card-border/50">
                <div
                  className="bg-sport-green h-full transition-all duration-300 ease-out"
                  style={{ width: `${bgProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. AJUSTE DE POSICIONAMENTO DA FOTO */}
      {hasImage && (
        <div className="flex flex-col gap-3 bg-[#161B26] border border-card-border p-3">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Settings2 className="w-4 h-4 text-sport-green" />
            Ajustar Foto no Molde
          </label>
          
          {/* Slider Escala/Zoom */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Zoom / Escala</span>
              <span className="text-white font-mono">{photoScale.toFixed(2)}x</span>
            </div>
            <input
              id="slider-photo-scale"
              type="range"
              min="0.4"
              max="3.0"
              step="0.05"
              value={photoScale}
              onChange={(e) => setPhotoScale(parseFloat(e.target.value))}
              className="w-full accent-sport-green h-1 bg-sport-dark rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider Posição X */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Posição Horizontal (X)</span>
              <span className="text-white font-mono">{photoX}px</span>
            </div>
            <input
              id="slider-photo-x"
              type="range"
              min="-250"
              max="250"
              step="1"
              value={photoX}
              onChange={(e) => setPhotoX(parseInt(e.target.value))}
              className="w-full accent-sport-green h-1 bg-sport-dark rounded-lg cursor-pointer"
            />
          </div>

          {/* Slider Posição Y */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Posição Vertical (Y)</span>
              <span className="text-white font-mono">{photoY}px</span>
            </div>
            <input
              id="slider-photo-y"
              type="range"
              min="-250"
              max="250"
              step="1"
              value={photoY}
              onChange={(e) => setPhotoY(parseInt(e.target.value))}
              className="w-full accent-sport-green h-1 bg-sport-dark rounded-lg cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 4. DADOS DE TEXTO DO CARD */}
      <div className="flex flex-col gap-4">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-card-border pb-1">
          3. Dados do Card
        </label>
        
        {/* Nome */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="input-player-name" className="text-xs text-gray-400 font-medium">
            Nome do Jogador
          </label>
          <input
            id="input-player-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            placeholder="Ex: NEYMAR JR"
            className="w-full bg-[#161B26] border border-card-border px-3 py-2 text-sm text-white focus:border-sport-green focus:outline-none transition-colors uppercase font-display tracking-wide"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Posição */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-player-position" className="text-xs text-gray-400 font-medium">
              Posição
            </label>
            <select
              id="input-player-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-[#161B26] border border-card-border px-3 py-2 text-sm text-white focus:border-sport-green focus:outline-none transition-colors uppercase font-display tracking-wide cursor-pointer"
            >
              <option value="ATA">ATA (Atacante)</option>
              <option value="MEI">MEI (Meia)</option>
              <option value="DEF">DEF (Defensor)</option>
              <option value="GOL">GOL (Goleiro)</option>
            </select>
          </div>

          {/* S (Overall) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="input-player-stat" className="text-xs text-gray-400 font-medium">
              Pontuação (Overall)
            </label>
            <input
              id="input-player-stat"
              type="text"
              value={statValue}
              onChange={(e) => setStatValue(e.target.value.slice(0, 3))}
              placeholder="Ex: 99"
              className="w-full bg-[#161B26] border border-card-border px-3 py-2 text-sm text-white focus:border-sport-green focus:outline-none transition-colors font-display tracking-wide text-center"
            />
          </div>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="input-player-team" className="text-xs text-gray-400 font-medium">
            País / Clube
          </label>
          <input
            id="input-player-team"
            type="text"
            value={team}
            onChange={(e) => setTeam(e.target.value.slice(0, 24))}
            placeholder="Ex: BRASIL"
            className="w-full bg-[#161B26] border border-card-border px-3 py-2 text-sm text-white focus:border-sport-green focus:outline-none transition-colors uppercase font-display tracking-wide"
          />
        </div>

        {/* Seleção de Molde/Tema */}
        <div className="flex flex-col gap-2 mt-2">
          <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider border-b border-card-border pb-1">
            Paleta de Cores do Card
          </label>
          <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setTheme(opt.id)}
                className={`w-full text-left p-2 border transition-all duration-150 cursor-pointer flex flex-col ${
                  theme === opt.id
                    ? "bg-[#1E293B] border-sport-green text-white"
                    : "bg-[#161B26] border-card-border text-gray-400 hover:bg-[#1C2433] hover:text-white"
                }`}
              >
                <span className="text-xs font-bold uppercase font-display tracking-wider">{opt.name}</span>
                <span className="text-[10px] text-gray-400 truncate">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. AJUSTES FINOS DE COORDENADAS (AVANÇADO - COLLAPSIBLE) */}
      <div className="flex flex-col border border-card-border/60 rounded-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full bg-[#161B26] hover:bg-[#1C2433] p-3 flex items-center justify-between text-xs font-bold text-white uppercase cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Settings2 className="w-4 h-4 text-sport-yellow" />
            Ajuste Fino de Layout (Canvas)
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-3 bg-[#11141D] flex flex-col gap-4 border-t border-card-border/60">
            {/* Nome Y */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Altura do Nome (Y)</span>
                <span className="text-white font-mono">{nameY}px</span>
              </div>
              <input
                id="slider-name-y"
                type="range"
                min="500"
                max="750"
                value={nameY}
                onChange={(e) => setNameY(parseInt(e.target.value))}
                className="w-full accent-sport-yellow h-1 bg-sport-dark rounded-lg cursor-pointer"
              />
            </div>

            {/* Time Y */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Altura do Time (Y)</span>
                <span className="text-white font-mono">{teamY}px</span>
              </div>
              <input
                id="slider-team-y"
                type="range"
                min="650"
                max="790"
                value={teamY}
                onChange={(e) => setTeamY(parseInt(e.target.value))}
                className="w-full accent-sport-yellow h-1 bg-sport-dark rounded-lg cursor-pointer"
              />
            </div>

            {/* Nota X */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Nota - Posição X</span>
                <span className="text-white font-mono">{overallX}px</span>
              </div>
              <input
                id="slider-overall-x"
                type="range"
                min="350"
                max="550"
                value={overallX}
                onChange={(e) => setOverallX(parseInt(e.target.value))}
                className="w-full accent-sport-yellow h-1 bg-sport-dark rounded-lg cursor-pointer"
              />
            </div>

            {/* Nota Y */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Nota - Posição Y</span>
                <span className="text-white font-mono">{overallY}px</span>
              </div>
              <input
                id="slider-overall-y"
                type="range"
                min="200"
                max="600"
                value={overallY}
                onChange={(e) => setOverallY(parseInt(e.target.value))}
                className="w-full accent-sport-yellow h-1 bg-sport-dark rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Botão de Exportação */}
      <button
        id="btn-download-sticker"
        type="button"
        onClick={onDownload}
        disabled={isRemovingBg}
        className="w-full bg-sport-green hover:bg-[#00E55C] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-black font-extrabold uppercase py-3.5 px-4 font-display tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-sport-green/20"
      >
        <Download className="w-5 h-5 stroke-[2.5]" />
        Baixar Figurinha (PNG)
      </button>

      {/* Avisos Técnicos */}
      <div className="flex gap-2 p-3 bg-sport-dark/50 border border-card-border/50 text-[10px] text-gray-400">
        <AlertCircle className="w-4 h-4 text-sport-yellow shrink-0" />
        <p className="leading-snug">
          Se o molde base estiver desalinhado com o texto, use a aba &quot;Ajuste Fino de Layout&quot; para reposicionar os campos perfeitamente.
        </p>
      </div>

      {/* Modal QR Code */}
      {showQrModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-[#11141D] border border-card-border p-6 max-w-sm w-full flex flex-col items-center gap-4 relative rounded-xs shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id="btn-close-qr-modal-x"
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer transition-colors p-1"
              aria-label="Fechar Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center flex flex-col gap-1 mt-2">
              <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide">
                Enviar Foto do Celular
              </h3>
              <p className="text-xs text-gray-400">
                Aponte a câmera do seu celular para o QR Code abaixo para abrir o criador diretamente no seu aparelho.
              </p>
            </div>

            <div className="bg-white p-3 border-4 border-sport-green rounded-xs shadow-lg flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`} 
                alt="QR Code do site" 
                className="w-40 h-40 select-none"
              />
            </div>

            <div className="text-center w-full">
              <span className="text-[10px] text-gray-500 block mb-1">URL do Site:</span>
              <span className="text-[11px] text-gray-400 font-mono bg-sport-dark/50 px-2 py-1 select-all break-all border border-card-border/50 block rounded-xs">
                {qrUrl}
              </span>
            </div>

            <button
              id="btn-close-qr-modal"
              type="button"
              onClick={() => setShowQrModal(false)}
              className="mt-2 w-full bg-sport-dark hover:bg-sport-dark/80 text-white font-bold py-2 px-4 text-xs uppercase tracking-wider rounded-xs cursor-pointer border border-card-border transition-colors"
            >
              Entendi, Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
