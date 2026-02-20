"use client";

import React from "react";
import { Box, Typography } from "@mui/material";

interface Props {
  size?: number;
  caption?: string;
}

export default function LoaderSnake({ size = 100, caption }: Props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ p: 2 }}
      mt="300px"
    >
      <div className="reputation-loader" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient
              id="snake-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#d4d4d4">
                <animate
                  attributeName="offset"
                  values="0;1;0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            className="snake-path"
            d="M 50,50 m -40,0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0"
            fill="none"
            stroke="url(#snake-gradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          <path
            className="snake-head"
            d="M 10,50 L 5,45 L 5,55 Z"
            fill="#d4d4d4"
          />
        </svg>
      </div>

      {caption && (
        <Typography variant="caption" sx={{ mt: 1 }}>
          {caption}
        </Typography>
      )}

      <style>{`
        .reputation-loader {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #000;
          padding: 12px;
          border-radius: 50%;
        }

        .reputation-loader svg {
          animation: rotate-snake 2.5s linear infinite;
          width: 100%;
          height: 100%;
        }

        .snake-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 0;
        }

        @keyframes rotate-snake {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .reputation-loader:hover {
          box-shadow: 0 0 15px rgba(212, 212, 212, 0.3);
          transition: box-shadow 0.3s ease;
        }
      `}</style>
    </Box>
  );
}
