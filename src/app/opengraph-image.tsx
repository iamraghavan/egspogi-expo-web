import { ImageResponse } from 'next/og';
export const alt = 'Science Expo 2026 — EGS Pillay Group of Institutions';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        background: '#073F91',
        color: '#FFF8E8',
        padding: 80,
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div style={{ fontSize: 23, marginBottom: 40 }}>EGS Pillay Group of Institutions</div>
      <div style={{ fontSize: 76, fontWeight: 700 }}>Science Expo</div>
      <div style={{ fontSize: 90, color: '#F7B817', fontWeight: 700 }}>2026.</div>
      <div style={{ fontSize: 22, marginTop: 30 }}>
        Space · Satellite · Racing · Aero · Innovation
      </div>
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 170,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: '#F7B817',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            border: '25px solid #073F91',
            display: 'flex',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 80,
          bottom: 80,
          width: 110,
          height: 65,
          background: '#F45B4F',
        }}
      />
    </div>,
    { ...size },
  );
}
