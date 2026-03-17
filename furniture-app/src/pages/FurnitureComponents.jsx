import React from 'react';

// 1. Chair (Realistic: Wooden curved legs, soft cushion seat, tilted backrest)

const MAT = {
  woodDark: { color: "#5a4636", roughness: 0.72, metalness: 0.03 },
  woodMid: { color: "#8b735d", roughness: 0.68, metalness: 0.02 },
  fabric: { roughness: 0.95, metalness: 0.0 },
  linen: { roughness: 0.92, metalness: 0.0 },
  painted: { color: "#d8d0c4", roughness: 0.65, metalness: 0.02 },
  metalSoft: { color: "#b8b9bb", roughness: 0.35, metalness: 0.75 },
  brass: { color: "#b08d57", roughness: 0.3, metalness: 0.9 },
};


  export const Chair = ({ w, d, h, color }) => {
  const legInset = Math.min(w, d) * 0.16;
  const seatY = h * 0.43;
  const legH = seatY - 0.04;
  const seatT = Math.max(0.06, h * 0.045);
  const cushionT = Math.max(0.09, h * 0.07);
  const backH = h - seatY - 0.06;

  return (
    <group>
      {/* tapered legs */}
      {[
        [-(w / 2) + legInset, legH / 2, -(d / 2) + legInset, 0.08],
        [(w / 2) - legInset, legH / 2, -(d / 2) + legInset, -0.08],
        [-(w / 2) + legInset, legH / 2, (d / 2) - legInset, -0.08],
        [(w / 2) - legInset, legH / 2, (d / 2) - legInset, 0.08],
      ].map((l, i) => (
        <mesh key={i} position={[l[0], l[1], l[2]]} rotation={[0, 0, l[3]]} castShadow receiveShadow>
          <cylinderGeometry args={[0.052, 0.026, legH, 18]} />
          <meshStandardMaterial {...MAT.woodDark} />
        </mesh>
      ))}

      {/* under-seat rails */}
      <mesh position={[0, seatY - seatT * 0.55, -(d / 2) + legInset]} castShadow receiveShadow>
        <boxGeometry args={[w - legInset * 1.5, 0.03, 0.03]} />
        <meshStandardMaterial {...MAT.woodDark} />
      </mesh>
      <mesh position={[0, seatY - seatT * 0.55, (d / 2) - legInset]} castShadow receiveShadow>
        <boxGeometry args={[w - legInset * 1.5, 0.03, 0.03]} />
        <meshStandardMaterial {...MAT.woodDark} />
      </mesh>

      {/* seat board */}
      <mesh position={[0, seatY, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, seatT, d]} />
        <meshStandardMaterial {...MAT.woodMid} />
      </mesh>

      {/* cushion */}
      <mesh position={[0, seatY + seatT / 2 + cushionT / 2 - 0.01, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.03, cushionT, d - 0.03]} />
        <meshPhysicalMaterial color={color} {...MAT.fabric} clearcoat={0.08} />
      </mesh>

      {/* backrest */}
      <group position={[0, seatY + backH / 2 + 0.03, -(d / 2) + 0.06]} rotation={[-0.1, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[w - 0.04, backH, 0.09]} />
          <meshPhysicalMaterial color={color} {...MAT.linen} clearcoat={0.06} />
        </mesh>
      </group>
    </group>
  );
};

// 2. Table (Realistic: Modern Glass Top with detailed wooden framework)
export const Table = ({ w, d, h, color }) => {
  const topThick = 0.05; 
  return (
    <group>
      {/* Wooden Legs */}
      <mesh position={[-(w/2)+0.15, (h-topThick)/2, -(d/2)+0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>
      <mesh position={[(w/2)-0.15, (h-topThick)/2, -(d/2)+0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>
      <mesh position={[-(w/2)+0.15, (h-topThick)/2, (d/2)-0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>
      <mesh position={[(w/2)-0.15, (h-topThick)/2, (d/2)-0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>
      
      {/* Wooden Frame Support */}
      <mesh position={[0, h - topThick - 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[w-0.1, 0.06, d-0.1]} />
        <meshStandardMaterial color="#2d1a11" roughness={0.8} />
      </mesh>

      {/* Glass Top (High Transmission) */}
      <mesh position={[0, h - topThick/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topThick, d]} />
        <meshPhysicalMaterial color={color} transmission={0.95} opacity={1} transparent metalness={0.1} roughness={0.02} ior={1.5} thickness={0.5} clearcoat={1} />
      </mesh>
    </group>
  );
};

// 3. Bed (Realistic: Thick mattress, distinct pillows, modern headboard, legs)
export const Bed = ({ w, d, h, color }) => {
  const baseH = h * 0.25;
  return (
    <group>
      {/* 4 Small Metal Legs */}
      <mesh position={[-(w/2)+0.2, 0.05, -(d/2)+0.2]}><cylinderGeometry args={[0.03,0.03,0.1,16]}/><meshStandardMaterial color="#7f8c8d" metalness={0.8}/></mesh>
      <mesh position={[(w/2)-0.2, 0.05, -(d/2)+0.2]}><cylinderGeometry args={[0.03,0.03,0.1,16]}/><meshStandardMaterial color="#7f8c8d" metalness={0.8}/></mesh>
      <mesh position={[-(w/2)+0.2, 0.05, (d/2)-0.2]}><cylinderGeometry args={[0.03,0.03,0.1,16]}/><meshStandardMaterial color="#7f8c8d" metalness={0.8}/></mesh>
      <mesh position={[(w/2)-0.2, 0.05, (d/2)-0.2]}><cylinderGeometry args={[0.03,0.03,0.1,16]}/><meshStandardMaterial color="#7f8c8d" metalness={0.8}/></mesh>

      {/* Bed Base */}
      <mesh position={[0, baseH/2 + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, baseH, d]} />
        <meshStandardMaterial color="#3e2723" roughness={0.7} />
      </mesh>
      
      {/* Thick Mattress */}
      <mesh position={[0, baseH + 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[w * 0.95, 0.35, d * 0.95]} />
          <meshStandardMaterial color="#fdfdfd" roughness={0.9} />
      </mesh>
      
      {/* Duvet / Blanket (Slightly larger than mattress) */}
      <mesh position={[0, baseH + 0.38, d*0.1]} castShadow receiveShadow>
          <boxGeometry args={[w * 0.97, 0.06, d * 0.75]} />
          <meshPhysicalMaterial color={color} roughness={0.9} sheen={0.5} />
      </mesh>

      {/* 2 Pillows */}
      <mesh position={[-w*0.22, baseH + 0.42, -d*0.35]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
         <boxGeometry args={[w*0.35, 0.12, 0.4]} />
         <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      <mesh position={[w*0.22, baseH + 0.42, -d*0.35]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
         <boxGeometry args={[w*0.35, 0.12, 0.4]} />
         <meshStandardMaterial color="#ffffff" roughness={1} />
      </mesh>
      
      {/* Tall Headboard */}
      <mesh position={[0, h*0.6, -d/2 + 0.05]} castShadow receiveShadow>
          <boxGeometry args={[w, h*1.1, 0.15]} />
          <meshStandardMaterial color="#2d1a11" roughness={0.8} />
      </mesh>
    </group>
  );
};

// 4. Cupboard/Wardrobe (Realistic: Multiple doors, bottom drawers, sleek handles)
export const Cupboard = ({ w, d, h, color }) => {
  return (
    <group>
      {/* Main Wardrobe Body */}
      <mesh position={[0, h/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.6} />
      </mesh>

      {/* Left Door */}
      <mesh position={[-w/4, h*0.6, d/2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w/2 - 0.04, h*0.75, 0.04]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.5} />
      </mesh>

      {/* Right Door */}
      <mesh position={[w/4, h*0.6, d/2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w/2 - 0.04, h*0.75, 0.04]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.5} />
      </mesh>

      {/* Bottom Drawer */}
      <mesh position={[0, h*0.12, d/2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.04, h*0.2, 0.04]} />
        <meshPhysicalMaterial color={color} roughness={0.3} clearcoat={0.5} />
      </mesh>
      
      {/* Handles (Long sleek bars) */}
      <mesh position={[-0.05, h*0.6, d/2 + 0.05]} castShadow receiveShadow>
         <boxGeometry args={[0.02, h*0.3, 0.02]} />
         <meshStandardMaterial color="#ecf0f1" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.05, h*0.6, d/2 + 0.05]} castShadow receiveShadow>
         <boxGeometry args={[0.02, h*0.3, 0.02]} />
         <meshStandardMaterial color="#ecf0f1" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Drawer Handle */}
      <mesh position={[0, h*0.12, d/2 + 0.05]} castShadow receiveShadow>
         <boxGeometry args={[w*0.4, 0.02, 0.02]} />
         <meshStandardMaterial color="#ecf0f1" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// 5. Sofa (Realistic: detailed cushions, separate base, armrests)
export const Sofa = ({ w, d, h, color }) => {
  const seatH = h * 0.4;
  const cushionW = (w - 0.6) / 3; 
  return (
    <group>
      {/* Small Legs */}
      <mesh position={[-(w/2)+0.1, 0.05, -(d/2)+0.1]}><boxGeometry args={[0.05,0.1,0.05]} /><meshStandardMaterial color="#222"/></mesh>
      <mesh position={[(w/2)-0.1, 0.05, -(d/2)+0.1]}><boxGeometry args={[0.05,0.1,0.05]} /><meshStandardMaterial color="#222"/></mesh>
      <mesh position={[-(w/2)+0.1, 0.05, (d/2)-0.1]}><boxGeometry args={[0.05,0.1,0.05]} /><meshStandardMaterial color="#222"/></mesh>
      <mesh position={[(w/2)-0.1, 0.05, (d/2)-0.1]}><boxGeometry args={[0.05,0.1,0.05]} /><meshStandardMaterial color="#222"/></mesh>

      {/* Base Frame */}
      <mesh position={[0, seatH/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, seatH - 0.1, d]} />
        <meshStandardMaterial color="#2d3436" roughness={0.9} />
      </mesh>

      {/* 3 Seat Cushions */}
      <mesh position={[-cushionW, seatH + 0.05, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[cushionW - 0.02, 0.15, d - 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0, seatH + 0.05, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[cushionW - 0.02, 0.15, d - 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[cushionW, seatH + 0.05, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[cushionW - 0.02, 0.15, d - 0.1]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* 3 Back Cushions (Tilted slightly) */}
      <mesh position={[-cushionW, seatH + (h-seatH)/2, -(d/2) + 0.2]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[cushionW - 0.02, h-seatH, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[0, seatH + (h-seatH)/2, -(d/2) + 0.2]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[cushionW - 0.02, h-seatH, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[cushionW, seatH + (h-seatH)/2, -(d/2) + 0.2]} rotation={[-0.1, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[cushionW - 0.02, h-seatH, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>

      {/* Armrests */}
      <mesh position={[-(w/2) + 0.15, seatH + 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.5, d]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh position={[(w/2) - 0.15, seatH + 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.5, d]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
};

// 6. Nightstand (NEW: Replaces Bookshelf - Perfect for beside the bed)
export const Nightstand = ({ w, d, h, color }) => {
  return (
    <group>
      {/* Main Body */}
      <mesh position={[0, h/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Top Drawer */}
      <mesh position={[0, h*0.75, d/2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w-0.05, h*0.4, 0.04]} />
        <meshStandardMaterial color="#fff" roughness={0.4} />
      </mesh>
      {/* Bottom Drawer */}
      <mesh position={[0, h*0.25, d/2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w-0.05, h*0.4, 0.04]} />
        <meshStandardMaterial color="#fff" roughness={0.4} />
      </mesh>
      {/* Knobs */}
      <mesh position={[0, h*0.75, d/2 + 0.05]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      <mesh position={[0, h*0.25, d/2 + 0.05]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color="#222" metalness={0.8} />
      </mesh>
      {/* Small Book on top */}
      <mesh position={[0, h + 0.02, 0]} rotation={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.04, 0.2]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  );
};

// 7. Dressing Table (NEW: Replaces Desk - Table with Mirror and small Stool)
export const DressingTable = ({ w, d, h, color }) => {
  const tableH = h * 0.42;
  const topThick = Math.max(0.14, h * 0.10);
  const legTopR = Math.max(0.02, h * 0.022);
  const legBottomR = Math.max(0.008, h * 0.0075);

  const drawerFaceH = topThick * 0.55;
  const knobR = Math.max(0.014, h * 0.007);

  const mirrorCenterY = tableH + (h - tableH) * 0.44;
  const mirrorR = Math.min(w * 0.28, (h - tableH) * 0.38);
  const mirrorFrameT = Math.max(0.025, h * 0.012);

  const stoolH = tableH * 0.52;
  const stoolR = Math.min(w * 0.09, d * 0.18);
  const stoolSeatR = stoolR * 1.35;
  const stoolSeatT = Math.max(0.07, h * 0.03);

  return (
    <group>
      {/* Elegant Metal Legs */}
      <mesh position={[-(w / 2) + 0.07, tableH / 2, -(d / 2) + 0.07]} castShadow receiveShadow>
        <cylinderGeometry args={[legTopR, legBottomR, tableH, 16]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[(w / 2) - 0.07, tableH / 2, -(d / 2) + 0.07]} castShadow receiveShadow>
        <cylinderGeometry args={[legTopR, legBottomR, tableH, 16]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-(w / 2) + 0.07, tableH / 2, (d / 2) - 0.07]} castShadow receiveShadow>
        <cylinderGeometry args={[legTopR, legBottomR, tableH, 16]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[(w / 2) - 0.07, tableH / 2, (d / 2) - 0.07]} castShadow receiveShadow>
        <cylinderGeometry args={[legTopR, legBottomR, tableH, 16]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main Table Body / Drawers */}
      <mesh position={[0, tableH, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topThick, d]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>

      {/* Drawer faces + knobs */}
      <mesh position={[-w / 4, tableH, d / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w / 2 - 0.04, drawerFaceH, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[w / 4, tableH, d / 2 + 0.02]} castShadow receiveShadow>
        <boxGeometry args={[w / 2 - 0.04, drawerFaceH, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-w / 4, tableH, d / 2 + 0.04]} castShadow receiveShadow>
        <sphereGeometry args={[knobR, 16, 16]} />
        <meshStandardMaterial color="#f1c40f" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[w / 4, tableH, d / 2 + 0.04]} castShadow receiveShadow>
        <sphereGeometry args={[knobR, 16, 16]} />
        <meshStandardMaterial color="#f1c40f" metalness={1} roughness={0.2} />
      </mesh>

      {/* Mirror */}
      <mesh position={[0, mirrorCenterY, -(d / 2) + 0.05]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[mirrorR, mirrorR, mirrorFrameT, 32]} />
        <meshStandardMaterial color="#f1c40f" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, mirrorCenterY, -(d / 2) + 0.07]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[mirrorR * 0.92, mirrorR * 0.92, mirrorFrameT + 0.002, 32]} />
        <meshPhysicalMaterial color="#ecf0f1" metalness={1} roughness={0} clearcoat={1} />
      </mesh>

      {/* Stool */}
      <mesh position={[0, stoolH / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[stoolR, stoolR, stoolH, 24]} />
        <meshStandardMaterial color="#f1c40f" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, stoolH + stoolSeatT / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[stoolSeatR, stoolSeatR, stoolSeatT, 24]} />
        <meshStandardMaterial color="#e74c3c" roughness={0.8} />
      </mesh>
    </group>
  );
};

// 8. BeanBag (NEW: Replaces Refrigerator - Very common in modern rooms)
export const BeanBag = ({ w, h, color }) => {
  return (
    <group>
      <mesh position={[0, h * 0.36, 0]} castShadow receiveShadow scale={[1, 0.68, 1]}>
        <sphereGeometry args={[w / 2, 36, 28]} />
        <meshPhysicalMaterial color={color} roughness={0.98} metalness={0} clearcoat={0.02} />
      </mesh>
      <mesh position={[0, h * 0.62, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.85, 0.25]}>
        <sphereGeometry args={[w / 3.1, 20, 16]} />
        <meshStandardMaterial color={color} roughness={0.98} metalness={0} />
      </mesh>
    </group>
  );
};

// 9. Lamp (Realistic: Floor Lamp with detailed base, pole, and glowing shade)
export const Lamp = ({ w, d, h, color }) => {
  return (
    <group>
      {/* Heavy Base */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w*0.4, w*0.4, 0.04, 32]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Main Pole */}
      <mesh position={[0, h/2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, h, 16]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lamp Shade */}
      <mesh position={[0, h - 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[w*0.5, w*0.6, 0.4, 32]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={0.9} />
      </mesh>
      {/* Light Bulb */}
      <mesh position={[0, h - 0.25, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffeba1" />
      </mesh>
      <pointLight position={[0, h - 0.3, 0]} intensity={1.5} color="#ffeba1" distance={6} />
    </group>
  );
};

// 10. TV Stand (Realistic: Modern Console with Flat Screen TV)
export const TVStand = ({ w, d, h, color }) => {
  const cabH = h * 0.4;
  return (
    <group>
      {/* Console Cabinet */}
      <mesh position={[0, cabH/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, cabH, d]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Middle open shelf area */}
      <mesh position={[0, cabH/2, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[w*0.5, cabH*0.6, d]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Soundbar / Setup Box in the shelf */}
      <mesh position={[0, cabH*0.3, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[w*0.4, 0.05, d*0.5]} />
        <meshStandardMaterial color="#000" roughness={0.2} />
      </mesh>

      {/* TV Base Neck */}
      <mesh position={[0, cabH + 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w*0.2, 0.02, d*0.4]} />
        <meshStandardMaterial color="#222" metalness={0.5} />
      </mesh>
      <mesh position={[0, cabH + 0.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.1, 16]} />
        <meshStandardMaterial color="#222" metalness={0.5} />
      </mesh>

      {/* Flat Screen TV */}
      <mesh position={[0, cabH + 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[w*0.9, 0.8, 0.04]} />
        <meshStandardMaterial color="#111" roughness={0.3} />
      </mesh>
      {/* TV Screen Panel */}
      <mesh position={[0, cabH + 0.6, 0.025]} castShadow receiveShadow>
        <boxGeometry args={[w*0.85, 0.75, 0.01]} />
        {/* Gives a nice TV screen reflection */}
        <meshPhysicalMaterial color="#2c3e50" metalness={0.8} roughness={0.1} clearcoat={1} emissive="#0f171e" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

// 11. Rug
export const Rug = ({ w, d, color }) => {
  return (
    <group>
      {/* Main rug body - very thin but textured */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.98} 
          metalness={0}
          side={2}
        />
      </mesh>

      {/* Slight thickness for realism */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <boxGeometry args={[w, 0.01, d]} />
        <meshStandardMaterial color={color} roughness={0.99} metalness={0} />
      </mesh>

      {/* Tassels on each short end */}
      {Array.from({ length: 8 }).map((_, i) => {
        const offset = (i - 3.5) * (w / 8);
        return (
          <React.Fragment key={`tassel-${i}`}>
            <mesh position={[offset, 0.005, (d / 2) + 0.03]} receiveShadow>
              <cylinderGeometry args={[0.008, 0.004, 0.06, 8]} />
              <meshStandardMaterial color={color} roughness={1} metalness={0} />
            </mesh>
            <mesh position={[offset, 0.005, -(d / 2) - 0.03]} receiveShadow>
              <cylinderGeometry args={[0.008, 0.004, 0.06, 8]} />
              <meshStandardMaterial color={color} roughness={1} metalness={0} />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* Subtle border pattern */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.min(w, d) * 0.46, Math.min(w, d) * 0.48, 64]} />
        <meshStandardMaterial 
          color={adjustRugBorderColor(color)} 
          roughness={0.97} 
          metalness={0}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};



// Helper function for rug border color
function adjustRugBorderColor(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  const darker = (val) => Math.max(0, val - 40);
  
  return `#${darker(r).toString(16).padStart(2, '0')}${darker(g).toString(16).padStart(2, '0')}${darker(b).toString(16).padStart(2, '0')}`;
}