import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment, SoftShadows, ContactShadows } from '@react-three/drei';
import DesignAPI from "../services/DesignAPI"
import { useParams } from 'react-router-dom';
//  HELPER FUNCTIONS 

// Brightness Adjustment Logic
const adjustBrightness = (hex, percent) => {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = parseInt(r * (100 + percent) / 100);
    g = parseInt(g * (100 + percent) / 100);
    b = parseInt(b * (100 + percent) / 100);

    r = (r < 255) ? r : 255;
    g = (g < 255) ? g : 255;
    b = (b < 255) ? b : 255;

    const rr = ((r.toString(16).length === 1) ? "0" + r.toString(16) : r.toString(16));
    const gg = ((g.toString(16).length === 1) ? "0" + g.toString(16) : g.toString(16));
    const bb = ((b.toString(16).length === 1) ? "0" + b.toString(16) : b.toString(16));

    return "#" + rr + gg + bb;
}

//  FURNITURE COMPONENTS (3D Models) 
const Chair = ({ w, d, h, color }) => {
  const seatH = h * 0.45;
  const legThick = 0.05;
  
  return (
    <group>
      {/* Modern Legs: Chrome Finish */}
      <mesh position={[-(w/2)+legThick, seatH/2, -(d/2)+legThick]} castShadow receiveShadow>
        <cylinderGeometry args={[legThick, 0.02, seatH, 32]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[(w/2)-legThick, seatH/2, -(d/2)+legThick]} castShadow receiveShadow>
        <cylinderGeometry args={[legThick, 0.02, seatH, 32]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[-(w/2)+legThick, seatH/2, (d/2)-legThick]} castShadow receiveShadow>
        <cylinderGeometry args={[legThick, 0.02, seatH, 32]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[(w/2)-legThick, seatH/2, (d/2)-legThick]} castShadow receiveShadow>
        <cylinderGeometry args={[legThick, 0.02, seatH, 32]} />
        <meshStandardMaterial color="#222" metalness={1} roughness={0.2} />
      </mesh>
      
      {/* Seat: Velvet Fabric Look (Sheen + Roughness) */}
      <mesh position={[0, seatH, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.15, d]} />
        <meshPhysicalMaterial 
            color={color} 
            roughness={0.8} 
            sheen={1} 
            sheenColor="white" 
            clearcoat={0}
        /> 
      </mesh>
      
      {/* Backrest: Rounded & Soft */}
      <group position={[0, seatH + (h-seatH)/2, -(d/2) + 0.05]}>
         <mesh castShadow receiveShadow>
            <boxGeometry args={[w, h-seatH, 0.08]} />
            <meshPhysicalMaterial 
                color={color} 
                roughness={0.8} 
                sheen={1} 
                sheenColor="white"
            />
         </mesh>
      </group>
    </group>
  );
};

const Table = ({ w, d, h, color }) => {
  const topThick = 0.05; 
  return (
    <group>
      {/* Legs: Matte Black Steel */}
      <mesh position={[-(w/2)+0.1, (h-topThick)/2, -(d/2)+0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[(w/2)-0.1, (h-topThick)/2, -(d/2)+0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[-(w/2)+0.1, (h-topThick)/2, (d/2)-0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      <mesh position={[(w/2)-0.1, (h-topThick)/2, (d/2)-0.1]} castShadow receiveShadow>
        <boxGeometry args={[0.08, h-topThick, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>
      
      {/* Support Beams */}
      <mesh position={[0, h - topThick - 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[w-0.2, 0.04, d-0.2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* TABLE TOP: REALISTIC TEMPERED GLASS */}
      <mesh position={[0, h - topThick/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, topThick, d]} />
        <meshPhysicalMaterial 
            color={color} 
            transmission={1}   // Fully transparent like glass
            opacity={1} 
            metalness={0} 
            roughness={0}      // Perfectly smooth
            ior={1.5}          // Index of Refraction for Glass
            thickness={0.5}    // Refraction thickness
            clearcoat={1}      // High polish
            attenuationColor="#ffffff"
            attenuationDistance={0.5}
        />
      </mesh>
    </group>
  );
};

const Bed = ({ w, d, h, color }) => {
  const baseH = h * 0.25;
  return (
    <group>
      {/* Base: Varnished Wood */}
      <mesh position={[0, baseH/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, baseH, d]} />
        <meshPhysicalMaterial 
            color="#4e342e" 
            roughness={0.5} 
            clearcoat={0.5} // Polished wood look
            clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Mattress: Cloth Fabric */}
      <mesh position={[0, baseH + 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[w * 0.95, 0.3, d * 0.95]} />
          <meshStandardMaterial color="white" roughness={1} />
      </mesh>
      
      {/* Duvet: Soft Fabric with Sheen */}
      <mesh position={[0, baseH + 0.17, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[w * 0.96, 0.28, d * 0.7]} />
          <meshPhysicalMaterial 
            color={color} 
            roughness={0.9} 
            sheen={0.5}
            sheenColor="white"
          />
      </mesh>

      {/* Pillows */}
      <mesh position={[-w*0.25, h*0.4, -d*0.35]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
         <boxGeometry args={[w*0.35, 0.15, 0.5]} />
         <meshStandardMaterial color="#f5f5f5" roughness={1} />
      </mesh>
      <mesh position={[w*0.25, h*0.4, -d*0.35]} rotation={[0.2, 0, 0]} castShadow receiveShadow>
         <boxGeometry args={[w*0.35, 0.15, 0.5]} />
         <meshStandardMaterial color="#f5f5f5" roughness={1} />
      </mesh>
      
      {/* Headboard: Leather/Tufted look */}
      <group position={[0, h*0.6, -d/2 + 0.05]}>
        <mesh castShadow receiveShadow>
            <boxGeometry args={[w, h, 0.15]} />
            <meshPhysicalMaterial 
                color="#3e2723" 
                roughness={0.4} 
                metalness={0.1}
            />
        </mesh>
      </group>
    </group>
  );
};

const Cupboard = ({ w, d, h, color }) => {
  return (
    <group>
      {/* Body: High Gloss Automotive Paint Look */}
      <mesh position={[0, h/2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshPhysicalMaterial 
            color={color} 
            metalness={0} 
            roughness={0.1} 
            clearcoat={1} // Super shiny varnish layer
            clearcoatRoughness={0.05}
        />
      </mesh>
      
      {/* Handles: Brushed Metal */}
      <mesh position={[w*0.15, h/2, d/2 + 0.05]} castShadow receiveShadow>
         <boxGeometry args={[0.03, h*0.5, 0.05]} />
         <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-w*0.15, h/2, d/2 + 0.05]} castShadow receiveShadow>
         <boxGeometry args={[0.03, h*0.5, 0.05]} />
         <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
};

// --- DATA ---

const FURNITURE_TYPES = [
  { name: 'Chair', w: 0.8, d: 0.8, h: 1.5, color: '#ff6b6b' },
  { name: 'Table', w: 3, d: 2, h: 1.2, color: '#4ecdc4' },
  { name: 'Bed', w: 4, d: 5, h: 1, color: '#1a535c' },
  { name: 'Cupboard', w: 2, d: 1, h: 4, color: '#ffe66d' },
];

function Design() {
    

    const [roomConfig, setRoomConfig] = useState({ 
        width: 12, depth: 12, 
        wallColor: '#eeeeee', floorColor: '#cccccc',
        globalShade: 0.8 
      });
      
    const [items, setItems] = useState([]);
    
    // Undo/Redo History States
    const [history, setHistory] = useState([[]]); // Stores array of 'items' arrays
    const [historyIndex, setHistoryIndex] = useState(0);
    
    const [selectedId, setSelectedId] = useState(null);
    const [viewMode, setViewMode] = useState('2D');
    const [dragItem, setDragItem] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, z: 0 });
    const [notification, setNotification] = useState(null); // Feedback message
    const roomRef = useRef(null);
    const [designName, setDesignName] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const loadDesignIfEditing = async () => {
        // Only run if there is an ID in the URL
            if (id) {
                console.log("Edit Mode: Fetching design", id);

                // 1. Call API
                const response = await DesignAPI.seletedDesign(id);

                // 2. Check Response
                if (response.success && response.data) {
                const loadedData = response.data;

                // 3. Load Data into State
                setItems(loadedData.items || []);
                
                if (loadedData.roomConfig) {
                    setRoomConfig(loadedData.roomConfig);
                }

                // SAVE THE NAME TO STATE
                setDesignName(loadedData.name);
                
                showNotification("Design Loaded! 📂");
                } else {
                showNotification("Error loading design ❌");
                }
            }
        };
        loadDesignIfEditing();
    }, [id]);
    
    // --- COLLISION DETECTION HELPER ---
    const checkCollision = (id, x, z, w, d) => {
        for (let item of items) {
        if (item.id === id) continue; // Stop checking in with yourself.

        // Axis-Aligned Bounding Box (AABB) Collision Logic
        // Checks if two items overlap using a mathematical method
        if (
            x < item.x + item.w &&
            x + w > item.x &&
            z < item.z + item.d &&
            z + d > item.z
        ) {
            return true; // Collision detected!
        }
        }
        return false; // No collision
    };

    // Helper to save state to history
    const saveToHistory = (newItems) => {
        const newHistory = history.slice(0, historyIndex + 1); // Remove future if we were in past
        newHistory.push(newItems);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setItems(newItems);
    };
 
    // UNDO Function
    const handleUndo = () => {
        if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setItems(history[historyIndex - 1]);
        showNotification("Action Undone");
        }
    };

    // REDO Function
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setItems(history[historyIndex + 1]);
        showNotification("Action Redone");
        }
    };

    // Feedback Notification
    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2000);
    };
    
    // Simulate Save to Database (Local Storage for now)
    const handleSaveDesign = async () => {
    const storedUserId = sessionStorage.getItem("userId");

    if (!storedUserId) {
      alert("Please log in to save your design! 🔒");
      return;
    }

    const nameInput = window.prompt("Please enter a name for your design:", designName);

    // Handle Cancel button
    if (nameInput === null) return; 

    //Calculate final name
    const finalName = nameInput.trim() || `Untitled ${new Date().toLocaleDateString()}`;
    
    // Update State 
    setDesignName(finalName); 

    const designPayload = {
      userId: storedUserId,
      name: finalName, 
      roomConfig: roomConfig,
      items: items
    };

    showNotification("Saving");

    let result;

    if (id) {
      //update existing
      console.log("Updating existing design:", id);
      result = await DesignAPI.updateDesign(id, designPayload); 
    } else {
      // create new
      console.log("Creating new design");
      result = await DesignAPI.createDesign(designPayload);
    }

    if (result.success) {
      showNotification(id ? "Design Updated! " : "Design Created! ");
    } else {
      showNotification(`Error: ${result.message} `);
    }
  };

    const addItem = (type) => {
        const newItem = {
        id: Date.now(),
        type: type.name,
        x: roomConfig.width / 2 - type.w / 2,
        z: roomConfig.depth / 2 - type.d / 2,
        w: type.w, d: type.d, h: type.h,
        color: type.color,
        rotation: 0 
        };
        const newItems = [...items, newItem];
        saveToHistory(newItems); // Push to history
        setSelectedId(newItem.id);
    };
    const updateSelectedItem = (key, value) => {
        const newItems = items.map(item => item.id === selectedId ? { ...item, [key]: value } : item);
        saveToHistory(newItems); // Push to history on change
    };

    const deleteSelectedItem = () => {
        const newItems = items.filter(i => i.id !== selectedId);
        saveToHistory(newItems);
        setSelectedId(null);
        showNotification("Item Deleted 🗑️");
    }

    const handleShadeChange = (amount) => {
        const item = items.find(i => i.id === selectedId);
        if(item) {
            const newColor = adjustBrightness(item.color, amount);
            updateSelectedItem('color', newColor);
        }
    }

    const handleMouseDown = (e, item) => {
        e.stopPropagation();
        if (!roomRef.current) return;
        const container = roomRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - container.left) / 40;
        const mouseZ = (e.clientY - container.top) / 40;
        setDragOffset({ x: mouseX - item.x, z: mouseZ - item.z });
        setSelectedId(item.id);
        setDragItem(item.id);
    };
    const handleMouseMove = (e) => {
    if (!dragItem || viewMode !== '2D' || !roomRef.current) return;
    
        const container = roomRef.current.getBoundingClientRect();
        const mouseX = (e.clientX - container.left) / 40;
        const mouseZ = (e.clientY - container.top) / 40;
        
        const activeItem = items.find(i => i.id === dragItem);
    
        if(activeItem) {
            let newX = mouseX - dragOffset.x;
            let newZ = mouseZ - dragOffset.z;
            
            // 1. Stops the room from going beyond the walls (Boundary Check)
            newX = Math.max(0, Math.min(newX, roomConfig.width - activeItem.w));
            newZ = Math.max(0, Math.min(newZ, roomConfig.depth - activeItem.d));

            // 2. Stops items from overlapping (Collision Check)
            // We check if moving to the new position causes a collision. If it does, we don't allow the move.
            
            // Check if moving only in the X direction causes a collision
            const isCollidingX = checkCollision(activeItem.id, newX, activeItem.z, activeItem.w, activeItem.d);
            // Check if moving only in the Z direction causes a collision
            const isCollidingZ = checkCollision(activeItem.id, activeItem.x, newZ, activeItem.w, activeItem.d);
            // Check if moving in both X and Z directions causes a collision
            const isCollidingBoth = checkCollision(activeItem.id, newX, newZ, activeItem.w, activeItem.d);

            let finalX = activeItem.x;
            let finalZ = activeItem.z;

            // Collision Logic: Allows movement only in the non-colliding direction (Gliding effect)
            if (!isCollidingBoth) {
                finalX = newX;
                finalZ = newZ;
            } else {
                if (!isCollidingX) finalX = newX; // If no collision on X, update X
                if (!isCollidingZ) finalZ = newZ; // If no collision on Z, update Z
            }
            
            // Update state directly
            setItems(items.map(i => i.id === dragItem ? { ...i, x: finalX, z: finalZ } : i));
        }
    };

    const handleMouseUp = () => {
        if(dragItem) {
            // Save to history only after drag ends
            saveToHistory(items);
            setDragItem(null);
        }
    };

    const selectedItem = items.find(i => i.id === selectedId);
  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
          
          {/* NOTIFICATION TOAST */}
          {notification && (
              <div style={{
                  position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                  background: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '5px',
                  zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}>
                  {notification}
              </div>
          )}
    
          {/* SIDEBAR */}
          <div style={{ width: '340px', padding: '20px', background: '#f0f2f5', borderRight: '1px solid #ddd', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{margin: 0, color: '#333'}}>🛋️ Furniture Planner</h2>
            
            {/* GLOBAL ACTIONS (Undo/Redo/Save) */}
            <div style={{display: 'flex', gap: '5px'}}>
                <button onClick={handleUndo} disabled={historyIndex === 0} style={historyIndex === 0 ? disabledBtn : actionBtn}>↩ Undo</button>
                <button onClick={handleRedo} disabled={historyIndex === history.length - 1} style={historyIndex === history.length - 1 ? disabledBtn : actionBtn}>↪ Redo</button>
                <button onClick={handleSaveDesign} style={{...actionBtn, background: '#007bff', color: 'white', marginLeft: 'auto'}}>💾 Save</button>
            </div>
    
            {/* 1. Global Settings */}
            <div style={cardStyle}>
              <h3 style={headingStyle}>1. Room Settings</h3>
              <div style={rowStyle}> <label>Width (ft):</label> <input type="number" value={roomConfig.width} onChange={e => setRoomConfig({...roomConfig, width: Number(e.target.value)})} style={inputStyle} /> </div>
              <div style={rowStyle}> <label>Depth (ft):</label> <input type="number" value={roomConfig.depth} onChange={e => setRoomConfig({...roomConfig, depth: Number(e.target.value)})} style={inputStyle} /> </div>
              
              <div style={rowStyle}> <label>Walls:</label> <input type="color" value={roomConfig.wallColor} onChange={e => setRoomConfig({...roomConfig, wallColor: e.target.value})} /> </div>
              <div style={rowStyle}> <label>Floor:</label> <input type="color" value={roomConfig.floorColor} onChange={e => setRoomConfig({...roomConfig, floorColor: e.target.value})} /> </div>
              
              <div style={{marginTop: '10px'}}>
                 <label style={{fontSize: '12px', fontWeight: 'bold'}}>Lighting Intensity:</label>
                 <input type="range" min="0.1" max="2" step="0.1" value={roomConfig.globalShade} onChange={e => setRoomConfig({...roomConfig, globalShade: Number(e.target.value)})} style={{width: '100%'}} />
              </div>
            </div>
    
            {/* 2. Add Furniture */}
            <div style={cardStyle}>
              <h3 style={headingStyle}>2. Catalog</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {FURNITURE_TYPES.map(type => (
                  <button key={type.name} onClick={() => addItem(type)} style={addItemBtn}>
                    <span style={{fontSize: '20px'}}>🪑</span> {type.name}
                  </button>
                ))}
              </div>
            </div>
    
            {/* 3. Selected Item Settings */}
            {selectedItem ? (
              <div style={{ ...cardStyle, border: '2px solid #007bff', background: '#fff' }}>
                <h3 style={headingStyle}>3. Edit: {selectedItem.type}</h3>
                
                <div style={rowStyle}>
                    <label>Color:</label> 
                    <input type="color" value={selectedItem.color} onChange={e => updateSelectedItem('color', e.target.value)} />
                </div>
    
                <div style={{marginBottom: '10px'}}>
                    <label style={{fontSize: '12px'}}>Shade / Brightness:</label>
                    <div style={{display: 'flex', gap: '5px', marginTop: '5px'}}>
                        <button onClick={() => handleShadeChange(-10)} style={smallBtn}>Darker</button>
                        <button onClick={() => handleShadeChange(10)} style={smallBtn}>Lighter</button>
                    </div>
                </div>
    
                <label style={{fontSize: '12px'}}>Rotation:</label>
                <input type="range" min="0" max="360" step="15" 
                       value={selectedItem.rotation * (180/Math.PI)}
                       onChange={e => updateSelectedItem('rotation', e.target.value * (Math.PI/180))}
                       style={{width: '100%', marginBottom: '10px'}} />
    
                <div style={rowStyle}><label>W:</label> <input type="range" min="0.5" max="6" step="0.1" value={selectedItem.w} onChange={e => updateSelectedItem('w', Number(e.target.value))} style={{width: '70%'}} /></div>
                <div style={rowStyle}><label>D:</label> <input type="range" min="0.5" max="6" step="0.1" value={selectedItem.d} onChange={e => updateSelectedItem('d', Number(e.target.value))} style={{width: '70%'}} /></div>
                
                <button onClick={deleteSelectedItem} style={{...actionBtn, background: '#dc3545', color: 'white', marginTop: '10px', width: '100%'}}>Delete Item</button>
              </div>
            ) : (
                 <div style={{padding: '20px', textAlign: 'center', color: '#888', border: '1px dashed #ccc', borderRadius: '8px'}}>Select an item to edit</div>
            )}
          </div>
    
          {/* CANVAS AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '15px', background: 'white', display: 'flex', justifyContent: 'center', gap: '20px', borderBottom: '1px solid #ddd' }}>
              <button onClick={() => setViewMode('2D')} style={viewMode === '2D' ? activeTabStyle : tabStyle}>📐 2D Plan</button>
              <button onClick={() => setViewMode('3D')} style={viewMode === '3D' ? activeTabStyle : tabStyle}>🧊 3D View</button>
            </div>
    
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e0e0e0' }}>
              
              {/* 2D VIEW */}
              {viewMode === '2D' && (
                <div 
                  onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                  style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: dragItem ? 'grabbing' : 'default' }}
                >
                  {/* Room Container */}
                  <div ref={roomRef} style={{ width: `${roomConfig.width * 40}px`, height: `${roomConfig.depth * 40}px`, background: 'white', border: `8px solid ${roomConfig.wallColor}`, position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                    {/* Grid Background */}
                    <div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#eee 1px, transparent 1px), linear-gradient(90deg, #eee 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 0}}></div>
                    
                    {/* Room Size Labels */}
                    <div style={{position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold'}}>{roomConfig.width} ft</div>
                    <div style={{position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontWeight: 'bold'}}>{roomConfig.depth} ft</div>
    
                    {items.map(item => (
                      <div key={item.id} onMouseDown={(e) => handleMouseDown(e, item)}
                        style={{
                          position: 'absolute', 
                          left: `${item.x * 40}px`, top: `${item.z * 40}px`, 
                          width: `${item.w * 40}px`, height: `${item.d * 40}px`,
                          backgroundColor: item.color, 
                          border: selectedId === item.id ? '3px solid #007bff' : '1px solid #555', 
                          zIndex: 10, cursor: 'grab', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px',
                          transform: `rotate(${item.rotation}rad)`,
                          transformOrigin: 'center center',
                          boxShadow: '2px 2px 5px rgba(0,0,0,0.2)'
                        }}>
                        <div style={{width: '100%', height: '100%', borderTop: '2px solid rgba(0,0,0,0.2)'}}></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
    
              {/* 3D VIEW */}
              {viewMode === '3D' && (
                // 1. Set shadows="soft". This makes edges smooth automatically.
                <Canvas camera={{ position: [20, 25, 20], fov: 40 }} shadows="soft" dpr={[1, 9]} style={{ background: '#e0e0e0' }}>
                  <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} />
                  
                  {/* --- FINAL REALISTIC & STABLE LIGHTING --- */}
    
                  {/* 2. Environment: the 'ambient light' inside the room. 
                  This prevents shadows from becoming too dark. Looks nicely balanced. */}
                  <Environment preset="city" intensity={0.5} />
    
                  {/*  3. ContactShadows (Optimized): darken where objects touch the floor. */}
                  <ContactShadows 
                    resolution={2048} 
                    scale={50} 
                    blur={2.5} 
                    opacity={roomConfig.globalShade * 0.5} 
                    far={10} 
                    color="#000000" 
                  />
                  
                  {/* 4. Lighting Setup */}
                  <ambientLight intensity={roomConfig.globalShade * 0.3} />
                  
                  {/* 5. Main Light (Directional): this casts the main shadow. 
                  shadow-radius={4} makes shadow edges softly blurred (soft). */}
                  <directionalLight 
                    position={[10, 20, 10]} 
                    intensity={roomConfig.globalShade * 2.8} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]} // The quality has been increased.
                    shadow-bias={-0.000001} // Reducing Shadow Acne
                    shadow-radius={4} // This is what makes the shadow soft and not flicker.
                  >
    
                    {/* When you enlarge the Shadow Camera, shadows fall across the entire room.*/}
                    <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
                  </directionalLight>
    
                  <group position={[-roomConfig.width / 2, 0, -roomConfig.depth / 2]}> 
                    {/* Floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[roomConfig.width / 2, -0.01, roomConfig.depth / 2]} receiveShadow>
                      <planeGeometry args={[roomConfig.width, roomConfig.depth]} />
                      <meshStandardMaterial color={roomConfig.floorColor} roughness={0.8} />
                    </mesh>
                    
                    {/* Walls */}
                    <mesh position={[roomConfig.width / 2, 4, 0]} receiveShadow>
                        <boxGeometry args={[roomConfig.width, 8, 0.2]} />
                        <meshStandardMaterial color={roomConfig.wallColor} />
                    </mesh>
                    <mesh position={[0, 4, roomConfig.depth / 2]} receiveShadow>
                        <boxGeometry args={[0.2, 8, roomConfig.depth]} />
                        <meshStandardMaterial color={roomConfig.wallColor} />
                    </mesh>
    
                    {/* Furniture Items */}
                    {items.map(item => (
                      <group key={item.id} position={[item.x + item.w / 2, 0, item.z + item.d / 2]} rotation={[0, -item.rotation, 0]}>
                        {/* Floating Label */}
                        {selectedId === item.id && (
                            <Html position={[0, item.h + 0.5, 0]} center>
                                <div style={{background: 'rgba(0,0,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>Selected</div>
                            </Html>
                        )}
                        {item.type === 'Chair' && <Chair w={item.w} d={item.d} h={item.h} color={item.color} />}
                        {item.type === 'Table' && <Table w={item.w} d={item.d} h={item.h} color={item.color} />}
                        {item.type === 'Bed' && <Bed w={item.w} d={item.d} h={item.h} color={item.color} />}
                        {item.type === 'Cupboard' && <Cupboard w={item.w} d={item.d} h={item.h} color={item.color} />}
                      </group>
                    ))}
                  </group>
                  <gridHelper args={[50, 50, 0xdddddd, 0xeeeeee]} position={[0, 0, 0]} />
                </Canvas>
              )}
    
            </div>
          </div>
        </div>
  )
}

// STYLES
const cardStyle = { background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const headingStyle = { fontSize: '14px', textTransform: 'uppercase', color: '#888', marginBottom: '10px', marginTop: 0 };
const rowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center', fontSize: '14px' };
const inputStyle = { width: '60px', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' };
const addItemBtn = { padding: '10px', cursor: 'pointer', background: 'white', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', transition: '0.2s' };
const actionBtn = { padding: '8px 12px', cursor: 'pointer', background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' };
const disabledBtn = { ...actionBtn, opacity: 0.5, cursor: 'not-allowed' };
const smallBtn = { padding: '4px 8px', cursor: 'pointer', background: '#f8f9fa', border: '1px solid #ccc', borderRadius: '4px', fontSize: '11px' };
const tabStyle = { padding: '8px 20px', cursor: 'pointer', border: 'none', background: 'transparent', fontSize: '16px', fontWeight: 'bold', color: '#666' };
const activeTabStyle = { ...tabStyle, color: '#007bff', borderBottom: '2px solid #007bff' };


export default Design
