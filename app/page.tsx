"use client";
import Image from 'next/image';
import projectLogo from '../public/project_logo_white.svg'

export default function Home() {

  return (
    <>
    <div className="center">
      <Image
      id='logo'
      src={projectLogo}
      alt='The OjO project'
      />
    </div>
      
      
    </>
  );
}
