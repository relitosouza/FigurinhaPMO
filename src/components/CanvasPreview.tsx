"use client";

// UX Audit Help: label placeholder aria-label
import React, { useRef, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface CanvasPreviewProps {
  name: string;
  statValue: string;
  team: string;
  position: string;
  theme: string;
  imageSrc: string | null;
  removeBg: boolean;
  isRemovingBg: boolean;
  onCanvasReady: (canvas: HTMLCanvasElement | null) => void;
  
  // Custom Template base
  templateSrc: string | null;

  // Photo adjustments
  photoScale: number;
  photoX: number;
  photoY: number;
  setPhotoX: (x: number) => void;
  setPhotoY: (y: number) => void;

  // Text coordinate overrides
  nameY: number;
  teamY: number;
  overallX: number;
  overallY: number;
}

// Map team names to country details for flag and vertical code rendering
function getCountryDetails(teamName: string): { code: string; name: string } {
  const t = teamName.trim().toUpperCase();
  if (!t) return { code: "BRA", name: "BRA" };
  
  if (t.includes("BRASIL") || t.includes("BRAZIL") || t === "BRA") return { code: "BRA", name: "BRA" };
  if (t.includes("ARGENTINA") || t === "ARG") return { code: "ARG", name: "ARG" };
  if (t.includes("ALEMANHA") || t.includes("GERMANY") || t === "GER") return { code: "GER", name: "GER" };
  if (t.includes("FRANÇA") || t.includes("FRANCE") || t === "FRA") return { code: "FRA", name: "FRA" };
  if (t.includes("ITÁLIA") || t.includes("ITALY") || t === "ITA") return { code: "ITA", name: "ITA" };
  if (t.includes("PORTUGAL") || t === "POR") return { code: "POR", name: "POR" };
  if (t.includes("ESPANHA") || t.includes("SPAIN") || t === "ESP") return { code: "ESP", name: "ESP" };
  if (t.includes("ESTADOS UNIDOS") || t.includes("USA") || t.includes("EUA")) return { code: "USA", name: "USA" };
  if (t.includes("INGLATERRA") || t.includes("ENGLAND") || t === "ENG") return { code: "ENG", name: "ENG" };
  if (t.includes("JAPÃO") || t.includes("JAPAN") || t === "JPN") return { code: "JPN", name: "JPN" };

  // Fallback: take first 3 letters
  const code = t.slice(0, 3).padEnd(3, "X");
  return { code, name: code };
}

// Draw flag circle
function drawFlag(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, code: string) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.clip();

  const w = r * 2;
  const h = r * 2;
  const left = x - r;
  const top = y - r;

  if (code === "BRA") {
    ctx.fillStyle = "#009739";
    ctx.fillRect(left, top, w, h);
    ctx.fillStyle = "#FEDF00";
    ctx.beginPath();
    ctx.moveTo(x, top + 6);
    ctx.lineTo(x + r - 6, y);
    ctx.lineTo(x, y + r - 6);
    ctx.lineTo(x - r + 6, y);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#002776";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x - 5, y + 10, r * 0.6, -Math.PI / 4, Math.PI / 12);
    ctx.stroke();
  } else if (code === "ARG") {
    ctx.fillStyle = "#74ACDF";
    ctx.fillRect(left, top, w, h);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(left, top + h/3, w, h/3);
    ctx.fillStyle = "#F6B426";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
  } else if (code === "FRA") {
    ctx.fillStyle = "#002395";
    ctx.fillRect(left, top, w/3, h);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(left + w/3, top, w/3, h);
    ctx.fillStyle = "#ED2939";
    ctx.fillRect(left + 2*w/3, top, w/3, h);
  } else if (code === "GER") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(left, top, w, h/3);
    ctx.fillStyle = "#DD0000";
    ctx.fillRect(left, top + h/3, w, h/3);
    ctx.fillStyle = "#FFCC00";
    ctx.fillRect(left, top + 2*h/3, w, h/3);
  } else if (code === "POR") {
    ctx.fillStyle = "#006600";
    ctx.fillRect(left, top, w * 0.4, h);
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(left + w * 0.4, top, w * 0.6, h);
    ctx.fillStyle = "#FFFF00";
    ctx.beginPath();
    ctx.arc(left + w * 0.4, y, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
  } else if (code === "ITA") {
    ctx.fillStyle = "#009246";
    ctx.fillRect(left, top, w/3, h);
    ctx.fillStyle = "#F1F2F1";
    ctx.fillRect(left + w/3, top, w/3, h);
    ctx.fillStyle = "#CE2B37";
    ctx.fillRect(left + 2*w/3, top, w/3, h);
  } else if (code === "ESP") {
    ctx.fillStyle = "#C60B1E";
    ctx.fillRect(left, top, w, h);
    ctx.fillStyle = "#FFC600";
    ctx.fillRect(left, top + h/4, w, h/2);
  } else if (code === "USA") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(left, top, w, h);
    ctx.fillStyle = "#B22234";
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(left, top + (i * 2 * h / 13), w, h / 13);
    }
    ctx.fillStyle = "#3C3B6E";
    ctx.fillRect(left, top, w * 0.5, h * 0.5);
  } else if (code === "ENG") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(left, top, w, h);
    ctx.fillStyle = "#CF081F";
    ctx.fillRect(left, y - h/10, w, h/5);
    ctx.fillRect(x - w/10, top, w/5, h);
  } else if (code === "JPN") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(left, top, w, h);
    ctx.fillStyle = "#BC002D";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(left, top, w, h);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, r - 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#111827";
    ctx.beginPath();
    ctx.arc(x, y, r * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export default function CanvasPreview({
  name,
  statValue,
  team,
  position,
  theme,
  imageSrc,
  removeBg,
  isRemovingBg,
  onCanvasReady,
  templateSrc,
  photoScale,
  photoX,
  photoY,
  setPhotoX,
  setPhotoY,
  nameY,
  teamY,
  overallX,
  overallY
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Track start point of mouse drag
  const dragStartRef = useRef({ x: 0, y: 0, photoX: 0, photoY: 0 });

  // Force re-render once font Barlow Condensed is loaded
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    }
  }, []);

  // -------------------------------------------------------------
  // Dragging event handlers to position player photo
  // -------------------------------------------------------------
  const handleStart = (clientX: number, clientY: number) => {
    if (!imageSrc) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      photoX: photoX,
      photoY: photoY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches && e.touches[0]) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Scale client drag movement to actual canvas coordinate resolution
    const scaleFactor = canvas.width / canvas.clientWidth;
    const dx = (clientX - dragStartRef.current.x) * scaleFactor;
    const dy = (clientY - dragStartRef.current.y) * scaleFactor;

    setPhotoX(Math.round(dragStartRef.current.photoX + dx));
    setPhotoY(Math.round(dragStartRef.current.photoY + dy));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches && e.touches[0]) {
      // Prevent mobile page scroll when aligning player photo inside canvas
      if (e.cancelable) e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // -------------------------------------------------------------
  // Canvas Render Loop
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 800;

    // Theme Color Mapping
    let colorBg = "#43C5D2";       // Classic Turquoise
    let colorGreen = "#009739";    // Green shape
    let colorYellow = "#FEDF00";   // Yellow box
    let bannerBg = "#106B70";      // Dark Teal
    let verticalPanelBg = "rgba(255, 255, 255, 0.85)";

    if (theme === "gold") {
      colorBg = "#ECC14C";
      colorGreen = "#594103";
      colorYellow = "#FFFFFF";
      bannerBg = "#4D3800";
    } else if (theme === "platinum") {
      colorBg = "#CFD8DC";
      colorGreen = "#455A64";
      colorYellow = "#ECEFF1";
      bannerBg = "#263238";
    } else if (theme === "fire") {
      colorBg = "#FF4500";
      colorGreen = "#380A00";
      colorYellow = "#FEDF00";
      bannerBg = "#5C1200";
    } else if (theme === "stealth") {
      colorBg = "#111827";
      colorGreen = "#374151";
      colorYellow = "#00FF66";
      bannerBg = "#1F2937";
      verticalPanelBg = "rgba(255, 255, 255, 0.9)";
    }

    const drawTextOverlays = () => {
      // 1. Draw Player Name Text (Top Pill)
      const displayName = name.trim() ? name.toUpperCase() : "NOME DO JOGADOR";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 30px 'Barlow Condensed', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayName, 245, nameY);

      // 2. Draw Team/Clube Text (Bottom Pill)
      const displayTeam = team.trim() ? team.toUpperCase() : "PAÍS / CLUBE";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "700 20px 'Barlow Condensed', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayTeam, 215, teamY);

      // 3. Draw Overall rating number
      const displayOverall = statValue.trim() ? statValue : "99";
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 24px 'Barlow Condensed', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayOverall, overallX, overallY);
    };

    const renderSticker = (imgTemplate: HTMLImageElement | null, imgPlayer: HTMLImageElement | null) => {
      ctx.save();
      
      const radius = 35;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      if (imgTemplate) {
        // CASE A: Custom Template Uploaded
        ctx.fillStyle = colorBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw template base first
        ctx.drawImage(imgTemplate, 0, 0, canvas.width, canvas.height);

        // Draw player photo on top of template, clipped to inner border (expanded upwards to fit the head)
        if (imgPlayer) {
          ctx.save();
          const cx = 250;
          const cy = 490;
          
          ctx.beginPath();
          ctx.rect(30, 30, 540, 640); // Clip from Y=30 to Y=670 to fit the head
          ctx.clip();

          ctx.save();
          ctx.translate(cx + photoX, cy + photoY);
          ctx.scale(photoScale, photoScale);

          const w = imgPlayer.width;
          const h = imgPlayer.height;
          const scale = Math.max(420 / w, 440 / h);
          const dw = w * scale;
          const dh = h * scale;

          ctx.drawImage(imgPlayer, -dw / 2, -dh / 2, dw, dh);
          ctx.restore();

          // Apply linear gradient mask (eraser effect) to blend the bottom smoothly
          const fadeGrad = ctx.createLinearGradient(0, 520, 0, 670);
          fadeGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
          fadeGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.95)");
          fadeGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.globalCompositeOperation = "destination-in";
          ctx.fillStyle = fadeGrad;
          ctx.fillRect(30, 30, 540, 640);

          ctx.restore();
        }

        drawTextOverlays();
      } else {
        // CASE B: Fallback Vector Template
        ctx.fillStyle = colorBg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = colorGreen;
        ctx.fillRect(40, 160, 80, 180);
        ctx.fillRect(40, 340, 240, 80);
        
        ctx.beginPath();
        ctx.arc(160, 160, 120, Math.PI, Math.PI * 2);
        ctx.lineTo(280, 240);
        ctx.arc(160, 160, 40, Math.PI * 2, Math.PI, true);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = colorYellow;
        ctx.fillRect(200, 200, 180, 140);

        ctx.fillStyle = colorGreen;
        ctx.beginPath();
        ctx.arc(380, 360, 130, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = colorBg;
        ctx.beginPath();
        ctx.arc(380, 360, 60, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(40, 100);             // Raise top clip to Y=100
        ctx.lineTo(460, 100);
        ctx.lineTo(460, 660);
        ctx.lineTo(90, 660);
        ctx.quadraticCurveTo(40, 660, 40, 610);
        ctx.closePath();
        ctx.clip();

        const glowGrad = ctx.createRadialGradient(250, 480, 60, 250, 480, 200);
        glowGrad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0.25)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(40, 100, 420, 560); // Expand background glow rect to start at Y=100

        if (imgPlayer) {
          ctx.save();
          const cx = 250;
          const cy = 490;
          ctx.translate(cx + photoX, cy + photoY);
          ctx.scale(photoScale, photoScale);

          const w = imgPlayer.width;
          const h = imgPlayer.height;
          const scale = Math.max(420 / w, 440 / h);
          const dw = w * scale;
          const dh = h * scale;

          ctx.drawImage(imgPlayer, -dw / 2, -dh / 2, dw, dh);
          ctx.restore();

          // Apply linear gradient mask (eraser effect) to blend the bottom smoothly
          const fadeGrad = ctx.createLinearGradient(0, 520, 0, 660);
          fadeGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
          fadeGrad.addColorStop(0.7, "rgba(0, 0, 0, 0.95)");
          fadeGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.globalCompositeOperation = "destination-in";
          ctx.fillStyle = fadeGrad;
          ctx.fillRect(40, 100, 420, 560);
        } else {
          ctx.fillStyle = theme === "platinum" ? "#455A64" : "rgba(255, 255, 255, 0.2)";
          ctx.beginPath();
          ctx.arc(230, 430, 38, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(230, 478);
          ctx.bezierCurveTo(170, 500, 110, 560, 110, 660);
          ctx.lineTo(350, 660);
          ctx.bezierCurveTo(350, 560, 290, 500, 230, 478);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        ctx.fillStyle = verticalPanelBg;
        ctx.save();
        ctx.beginPath();
        const px = 475;
        const py = 440;
        const pw = 85;
        const ph = 285;
        const pr = 20;
        ctx.moveTo(px + pr, py);
        ctx.lineTo(px + pw - pr, py);
        ctx.quadraticCurveTo(px + pw, py, px + pw, py + pr);
        ctx.lineTo(px + pw, py + ph - pr);
        ctx.quadraticCurveTo(px + pw, py + ph, px + pw - pr, py + ph);
        ctx.lineTo(px + pr, py + ph);
        ctx.quadraticCurveTo(px, py + ph, px, py + ph - pr);
        ctx.lineTo(px, py + pr);
        ctx.quadraticCurveTo(px, py, px + pr, py);
        ctx.closePath();
        ctx.fill();

        const countryDetails = getCountryDetails(team);
        drawFlag(ctx, px + pw/2, py + 45, 25, countryDetails.code);

        ctx.fillStyle = "#FFFFFF";
        ctx.strokeStyle = bannerBg;
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.font = "900 44px 'Barlow Condensed', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const letters = countryDetails.name.toUpperCase().split("").slice(0, 3);
        letters.forEach((char, idx) => {
          const charY = py + 115 + (idx * 55);
          ctx.strokeText(char, px + pw/2, charY);
          ctx.fillText(char, px + pw/2, charY);
        });
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 86px 'Barlow Condensed', sans-serif";
        ctx.textAlign = "right";
        ctx.textBaseline = "top";
        ctx.fillText("2", 560, 30);
        ctx.fillText("6", 560, 95);

        ctx.fillStyle = "#FFD700";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(480, 50);
        ctx.lineTo(505, 50);
        ctx.lineTo(500, 75);
        ctx.quadraticCurveTo(492, 90, 492, 105);
        ctx.lineTo(492, 115);
        ctx.lineTo(502, 120);
        ctx.lineTo(483, 120);
        ctx.lineTo(492, 115);
        ctx.lineTo(492, 105);
        ctx.quadraticCurveTo(492, 90, 485, 75);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 12px 'Barlow Condensed', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("FIFA", 492, 138);
        ctx.restore();

        ctx.fillStyle = bannerBg;
        ctx.save();
        ctx.beginPath();
        const nPillX = 40;
        const nPillY = 670;
        const nPillW = 410;
        const nPillH = 55;
        const nPillR = 25;
        if (ctx.roundRect) {
          ctx.roundRect(nPillX, nPillY, nPillW, nPillH, nPillR);
        } else {
          ctx.rect(nPillX, nPillY, nPillW, nPillH);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = bannerBg;
        ctx.save();
        ctx.beginPath();
        const tPillX = 40;
        const tPillY = 735;
        const tPillW = 350;
        const tPillH = 45;
        const tPillR = 20;
        if (ctx.roundRect) {
          ctx.roundRect(tPillX, tPillY, tPillW, tPillH, tPillR);
        } else {
          ctx.rect(tPillX, tPillY, tPillW, tPillH);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.save();
        const panX = 410;
        const panY = 740;
        const panW = 150;
        const panH = 40;
        ctx.fillStyle = "#FEDF00";
        ctx.fillRect(panX, panY, panW, panH);
        ctx.strokeStyle = "#ED1C24";
        ctx.lineWidth = 3;
        ctx.strokeRect(panX, panY, panW, panH);
        ctx.fillStyle = "#ED1C24";
        ctx.font = "900 19px 'Barlow Condensed', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PANINI", panX + panW/2 + 10, panY + panH/2);

        ctx.fillStyle = "#ED1C24";
        ctx.beginPath();
        ctx.moveTo(panX + 15, panY + 10);
        ctx.lineTo(panX + 30, panY + 10);
        ctx.lineTo(panX + 30, panY + 24);
        ctx.quadraticCurveTo(panX + 30, panY + 32, panX + 22.5, panY + 34);
        ctx.quadraticCurveTo(panX + 15, panY + 32, panX + 15, panY + 24);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#0047AB";
        ctx.fillRect(panX + 21, panY + 13, 3, 15);
        ctx.fillRect(panX + 18, panY + 19, 9, 3);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = colorYellow;
        ctx.beginPath();
        ctx.arc(overallX, overallY, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bannerBg;
        ctx.beginPath();
        ctx.arc(overallX, overallY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        drawTextOverlays();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(radius, 4);
        ctx.lineTo(canvas.width - radius, 4);
        ctx.quadraticCurveTo(canvas.width - 4, 4, canvas.width - 4, radius);
        ctx.lineTo(canvas.width - 4, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width - 4, canvas.height - 4, canvas.width - radius, canvas.height - 4);
        ctx.lineTo(radius, canvas.height - 4);
        ctx.quadraticCurveTo(4, canvas.height - 4, 4, canvas.height - radius);
        ctx.lineTo(4, radius);
        ctx.quadraticCurveTo(4, 4, radius, 4);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
      onCanvasReady(canvas);
    };

    const loadAndRender = async () => {
      let imgTemplate: HTMLImageElement | null = null;
      let imgPlayer: HTMLImageElement | null = null;

      if (templateSrc) {
        imgTemplate = await new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.error("Failed to load template:", templateSrc);
            resolve(null);
          };
          img.src = templateSrc;
        });
      }

      if (imageSrc) {
        imgPlayer = await new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.error("Failed to load player image:", imageSrc);
            resolve(null);
          };
          img.src = imageSrc;
        });
      }

      renderSticker(imgTemplate, imgPlayer);
    };

    loadAndRender();
  }, [
    name,
    statValue,
    team,
    position,
    theme,
    imageSrc,
    templateSrc,
    removeBg,
    fontLoaded,
    photoScale,
    photoX,
    photoY,
    nameY,
    teamY,
    overallX,
    overallY,
    onCanvasReady
  ]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Aspect-ratio wrapper */}
      <div className="relative w-full max-w-[360px] aspect-[3/4] bg-sport-dark border border-card-border p-1 shadow-2xl overflow-hidden group">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
          className={`w-full h-full object-contain ${
            imageSrc ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
          }`}
          style={{ imageRendering: "auto", touchAction: "none" }}
        />
        
        {/* Loading watermark Overlay */}
        {isRemovingBg && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-sport-green/20 border-t-sport-green animate-spin" />
              <Sparkles className="w-6 h-6 text-sport-green absolute inset-0 m-auto animate-pulse" />
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-widest font-display">
              Processando IA...
            </span>
          </div>
        )}
      </div>
      
      <p className="text-[10px] text-gray-500 font-medium">
        {imageSrc ? "🖱️ Clique e arraste na imagem para reposicionar" : "Carregue uma foto para habilitar o arrastar"}
      </p>
    </div>
  );
}
