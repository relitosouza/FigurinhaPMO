"use client";

// UX Audit Help: label placeholder aria-label
import React, { useState, useCallback, useRef, useEffect } from "react";
import ControlPanel from "./ControlPanel";
import CanvasPreview from "./CanvasPreview";

export default function StickerGenerator() {
  // Inputs state
  const [name, setName] = useState("NEYMAR JR");
  const [statValue, setStatValue] = useState("99");
  const [team, setTeam] = useState("BRASIL");
  const [position, setPosition] = useState("ATA");
  const [theme, setTheme] = useState("oficial");

  // Custom template state
  const [templateSrc, setTemplateSrc] = useState<string | null>("/figurinha.svg");

  // Photo positioning adjustments
  const [photoScale, setPhotoScale] = useState(1.0);
  const [photoX, setPhotoX] = useState(0);
  const [photoY, setPhotoY] = useState(0);

  // Text coordinate positions (matching default Panini 2026 vector template)
  const [nameY, setNameY] = useState(697);
  const [teamY, setTeamY] = useState(757);
  const [overallX, setOverallX] = useState(425);
  const [overallY, setOverallY] = useState(350);

  // Image and processing state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [removeBg, setRemoveBg] = useState(true);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState(0);

  // Reference to current canvas for exporting
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clean up ObjectURLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
      if (templateSrc && templateSrc !== "/figurinha.svg") {
        URL.revokeObjectURL(templateSrc);
      }
    };
  }, [imageSrc, templateSrc]);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  }, []);

  // Process and set player image
  const processImage = async (file: File, shouldRemoveBg: boolean) => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }

    if (shouldRemoveBg) {
      setIsRemovingBg(true);
      setBgProgress(0);
      try {
        const bgModule = await import("@imgly/background-removal");
        const removeBackground = (bgModule.default || bgModule.removeBackground) as unknown as (
          image: File,
          configuration?: { progress?: (key: string, current: number, total: number) => void }
        ) => Promise<Blob>;
        
        const processedBlob = await removeBackground(file, {
          progress: (key: string, current: number, total: number) => {
            const pct = Math.round((current / total) * 100);
            setBgProgress(pct);
          }
        });

        const url = URL.createObjectURL(processedBlob);
        setImageSrc(url);
        
        // Reset positioning on new image upload
        setPhotoScale(1.0);
        setPhotoX(0);
        setPhotoY(0);
      } catch (err) {
        console.error("Background removal failed, falling back to original image:", err);
        alert("A remoção de fundo com IA falhou devido a limitações do navegador. Renderizando com fundo original.");
        const url = URL.createObjectURL(file);
        setImageSrc(url);
      } finally {
        setIsRemovingBg(false);
      }
    } else {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setPhotoScale(1.0);
      setPhotoX(0);
      setPhotoY(0);
    }
  };

  const handleImageSelected = async (file: File) => {
    setOriginalFile(file);
    await processImage(file, removeBg);
  };

  const handleRemoveBgToggle = async (newVal: boolean) => {
    setRemoveBg(newVal);
    if (originalFile) {
      await processImage(originalFile, newVal);
    }
  };

  const handleResetImage = () => {
    if (imageSrc) {
      URL.revokeObjectURL(imageSrc);
    }
    setImageSrc(null);
    setOriginalFile(null);
    setBgProgress(0);
    setIsRemovingBg(false);
    setPhotoScale(1.0);
    setPhotoX(0);
    setPhotoY(0);
  };

  const handleTemplateSelected = (file: File) => {
    if (templateSrc && templateSrc !== "/figurinha.svg") {
      URL.revokeObjectURL(templateSrc);
    }
    const url = URL.createObjectURL(file);
    setTemplateSrc(url);
  };

  const handleResetTemplate = () => {
    if (templateSrc && templateSrc !== "/figurinha.svg") {
      URL.revokeObjectURL(templateSrc);
    }
    setTemplateSrc("/figurinha.svg");
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert("Erro ao exportar: o Canvas ainda não está pronto!");
      return;
    }

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      
      const cleanName = name.trim() ? name.toLowerCase().replace(/\s+/g, "-") : "jogador";
      link.download = `figurinha-${cleanName}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export canvas:", err);
      alert("O download falhou devido a restrições de segurança do navegador. Tente novamente.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-card-border pb-6 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase font-display text-white">
            MONTE SUA <span className="text-sport-green">FIGURINHA</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-xl">
            Faça upload do seu próprio molde ou utilize o modelo padrão oficial da Copa do Mundo 2026. Recorte com IA no próprio navegador e baixe em alta resolução.
          </p>
        </div>
        
        {/* Stats bar */}
        <div className="hidden sm:flex items-center gap-4 bg-card-bg border border-card-border px-4 py-2 select-none">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">RESOLUÇÃO</span>
            <span className="text-sm font-bold text-white font-display">600 x 800 PX @ 2x</span>
          </div>
          <div className="w-px h-8 bg-card-border" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">MOTOR DE IA</span>
            <span className="text-sm font-bold text-sport-green font-display">WASM ONNX</span>
          </div>
        </div>
      </div>

      {/* Main Grid display layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Left Column: Form Settings */}
        <div className="w-full lg:w-auto order-2 lg:order-1 shrink-0">
          <ControlPanel
            name={name}
            setName={setName}
            statValue={statValue}
            setStatValue={setStatValue}
            team={team}
            setTeam={setTeam}
            position={position}
            setPosition={setPosition}
            theme={theme}
            setTheme={setTheme}
            removeBg={removeBg}
            setRemoveBg={handleRemoveBgToggle}
            isRemovingBg={isRemovingBg}
            bgProgress={bgProgress}
            onImageSelected={handleImageSelected}
            onDownload={handleDownload}
            hasImage={!!imageSrc}
            onResetImage={handleResetImage}
            onTemplateSelected={handleTemplateSelected}
            hasTemplate={templateSrc !== null && templateSrc !== "/figurinha.svg"}
            onResetTemplate={handleResetTemplate}
            photoScale={photoScale}
            setPhotoScale={setPhotoScale}
            photoX={photoX}
            setPhotoX={setPhotoX}
            photoY={photoY}
            setPhotoY={setPhotoY}
            nameY={nameY}
            setNameY={setNameY}
            teamY={teamY}
            setTeamY={setTeamY}
            overallX={overallX}
            setOverallX={setOverallX}
            overallY={overallY}
            setOverallY={setOverallY}
          />
        </div>

        {/* Right Column: Canvas Preview Container */}
        <div className="w-full flex-1 order-1 lg:order-2 bg-card-bg border border-card-border p-6 md:p-12 flex items-center justify-center min-h-[480px] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-background to-background pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-sport-green/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sport-yellow/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 w-full flex justify-center">
            <CanvasPreview
              name={name}
              statValue={statValue}
              team={team}
              position={position}
              theme={theme}
              imageSrc={imageSrc}
              removeBg={removeBg}
              isRemovingBg={isRemovingBg}
              onCanvasReady={handleCanvasReady}
              templateSrc={templateSrc}
              photoScale={photoScale}
              photoX={photoX}
              photoY={photoY}
              setPhotoX={setPhotoX}
              setPhotoY={setPhotoY}
              nameY={nameY}
              teamY={teamY}
              overallX={overallX}
              overallY={overallY}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
