import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 320,
          background: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        🎙️
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
