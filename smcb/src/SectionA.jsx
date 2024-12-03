import React, { useState, useEffect, useRef } from "react";
import "./SectionA.css";

const typingSound = new Audio("/ddddddddd.mp3"); // Ajuste o caminho conforme necessário

function SectionA() {
  const fakeLines = [
    "npm install website",
    "npm installing packages...",
    "- style v9.9.9 installed.",
    "- markup v0.1.0 installed.",
    "- scripts v9.9.9 installed.",
    "- 10 billion dependencies installed.",
    "Make website responsive? (yes/no)",
    "yes, pump it.",
    "Make website accessible? (yes/no)",
    "yes, just do it.",
    "Finalizing...",
    "Website complete! Wasn't that easy?",
    "Now next stop is the moon." 
  ];

  const lineDelays = [500, 1000, 1000, 200, 200, 200, 1200, 500, 800, 1000, 800, 1000, 200];
  const typingSpeeds = [100, 0, 0, 0, 0, 0, 0, 100, 0, 100, 0, 0];
  const lineSounds = [true, false, false, false, false, false, false, true, false, true, false, false, false];

  const [displayedText, setDisplayedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [showFinalCursor, setShowFinalCursor] = useState(false);

  const consoleRef = useRef(null);

  const handleUserInteraction = () => {
    setHasInteracted(true);
    setShowConsole(true);
    typingSound.play().catch((error) => {
      console.error("Erro ao tocar som:", error);
    });
    startTyping();
  };

  const startTyping = () => {
    setDisplayedText(""); // Limpar texto exibido antes de começar
    setCurrentLine(0);
    setCurrentChar(0);
    setIsTyping(true);
  };

  useEffect(() => {
    if (hasInteracted && isTyping) {
      if (currentLine < fakeLines.length) {
        const line = fakeLines[currentLine];

        if (currentChar < line.length) {
          const typingInterval = setInterval(() => {
            setDisplayedText((prevText) => prevText + line[currentChar]);
            setCurrentChar((prevChar) => prevChar + 1);
            // Verificar se o som deve ser reproduzido
            if (lineSounds[currentLine]) {
              typingSound.play().catch((error) => {
                console.error("Erro ao tocar som:", error);
              });
            }
          }, typingSpeeds[currentLine]);

          return () => clearInterval(typingInterval);
        } else {
          // Pausa o som no final da linha
          if (lineSounds[currentLine]) {
            typingSound.pause();
            typingSound.currentTime = 0; // Reinicia o som
          }

          const lineBreakInterval = setTimeout(() => {
            setDisplayedText((prevText) => prevText + "\n"); // Adiciona quebra de linha
            setCurrentLine((prevLine) => prevLine + 1); // Avança para a próxima linha
            setCurrentChar(0); // Reseta o contador de caracteres
            
            // Verifique se é a última linha
            if (currentLine + 1 === fakeLines.length) {
              setShowFinalCursor(true);
            }
          }, lineDelays[currentLine]); // Usar o tempo de delay definido

          return () => clearTimeout(lineBreakInterval);
        }
      } else {
        typingSound.pause(); // Pausa o som ao final
      }
    }
  }, [currentLine, currentChar, fakeLines, lineDelays, typingSpeeds, isTyping, hasInteracted]);

  return (
    <div className="container">
      {!hasInteracted && (
        <button onClick={handleUserInteraction}><p>START CODE</p></button>
      )}
      {hasInteracted && (
        <div className="console" ref={consoleRef} style={{ opacity: showConsole ? 1 : 0 }}>
          <pre style={{ display: 'inline' }}>{displayedText}</pre>
          {/* Exibir cursor na linha atual se ela requer som e não está na última linha */}
          {lineSounds[currentLine] && currentLine < fakeLines.length - 1 && (
            <span className="cursor"></span>
          )}
          {/* Exibir cursor ao final, após todas as linhas serem digitadas */}
          {showFinalCursor && (
            <span className="cursor"></span>
          )}
        </div>
      )}
    </div>
  );
}

export default SectionA;
