"use client";
import Image from 'next/image';
import projectLogo from '../public/project_logo_white.svg'

export default function NavBar() {

  return (
    <>
      <nav style={{
        padding:20,
        textAlign:"center"
        }}>
          <Image
            src={projectLogo}
            alt='OJO'
            style={{
              maxHeight:100,
              width:200
            }}
          />
      </nav>
    </>
  );
}
