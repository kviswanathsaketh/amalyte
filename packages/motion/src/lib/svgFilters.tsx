// GlassDispersionFilter — real per-channel chromatic-dispersion SVG filter,
// shared by GlassCard (built later) via backdrop-filter: url(#id) blur() saturate().
// Applies feTurbulence + feDisplacementMap three times at slightly different
// scales, each isolated to one color channel via feColorMatrix, then
// recombined with feBlend mode="screen". Kept subtle: low-frequency
// turbulence, low octaves — light refraction disturbance, not distortion.

export function GlassDispersionFilter({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          {/* Shared turbulence source */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012"
            numOctaves={2}
            seed={7}
            result="noise"
          />

          {/* Red channel — displaced at the smallest scale */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispR"
          />
          <feColorMatrix
            in="dispR"
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="chanR"
          />

          {/* Green channel — mid scale */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispG"
          />
          <feColorMatrix
            in="dispG"
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="chanG"
          />

          {/* Blue channel — largest scale */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispB"
          />
          <feColorMatrix
            in="dispB"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
            result="chanB"
          />

          {/* Recombine the three isolated, differently-displaced channels */}
          <feBlend in="chanR" in2="chanG" mode="screen" result="blendRG" />
          <feBlend in="blendRG" in2="chanB" mode="screen" />
        </filter>
      </defs>
    </svg>
  );
}
