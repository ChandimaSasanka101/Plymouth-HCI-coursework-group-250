import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Environment, ContactShadows } from '@react-three/drei';
import { BsGrid3X3 } from 'react-icons/bs';
import { BiCube } from 'react-icons/bi';
import { FiSave } from 'react-icons/fi';
import { HiOutlineArrowUturnLeft, HiOutlineArrowUturnRight } from 'react-icons/hi2';
import {
  MdBed,
  MdChair,
  MdDoorFront,
  MdEventSeat,
  MdLight,
  MdTableBar,
  MdTableRestaurant,
  MdTv,
  MdViewAgenda,
  MdWeekend,
} from 'react-icons/md';
import DesignAPI from "../services/DesignAPI"
import { useParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { Chair, Table, Bed, Cupboard, Sofa, Nightstand, DressingTable, BeanBag, Lamp, TVStand, Rug } from './FurnitureComponents';
import './Design.css';
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



// --- DATA ---
const FURNITURE_TYPES = [
  { name: 'Chair', icon: MdChair, w: 0.85, d: 0.85, h: 1.45, color: '#b39a86' },
  { name: 'Table', icon: MdTableRestaurant, w: 2.6, d: 1.4, h: 1.1, color: '#9b866f' },
  { name: 'Bed', icon: MdBed, w: 4.2, d: 5.2, h: 1.05, color: '#c7b7a3' },
  { name: 'Cupboard', icon: MdDoorFront, w: 2.2, d: 1.0, h: 4.1, color: '#d8d0c4' },
  { name: 'Sofa', icon: MdWeekend, w: 3.6, d: 1.4, h: 1.35, color: '#a7907a' },
  { name: 'Nightstand', icon: MdTableBar, w: 1.0, d: 0.85, h: 1.45, color: '#8d775f' },
  { name: 'DressingTable', icon: MdTableBar, w: 2.4, d: 1.0, h: 2.2, color: '#b8a18a' },
  { name: 'BeanBag', icon: MdEventSeat, w: 1.8, d: 1.8, h: 1.2, color: '#7f8b7a' },
  { name: 'Lamp', icon: MdLight, w: 0.55, d: 0.55, h: 2.8, color: '#d9d2c4' },
  { name: 'TVStand', icon: MdTv, w: 3.4, d: 0.95, h: 1.7, color: '#6f6257' },
  { name: 'Rug', icon: MdViewAgenda, w: 4.5, d: 3.0, h: 0.01, color: '#9e8b7e' },
];

const ROOM_SHAPE_OPTIONS = [
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'l-shape', label: 'L-Shape' },
  { id: 'l-shape-mirror', label: 'L-Shape (Mirror)' },
  { id: 'l-shape-bottom-left', label: 'L-Shape (Bottom Left)' },
  { id: 'l-shape-bottom-right', label: 'L-Shape (Bottom Right)' },
  { id: 'u-shape', label: 'U-Shape' },
];

const getRoomClipPath = (shape) => {
  if (shape === 'l-shape') return 'polygon(0% 0%, 50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%)';
  if (shape === 'l-shape-mirror') return 'polygon(50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%, 50% 50%)';
  if (shape === 'l-shape-bottom-left') return 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%, 0% 50%)';
  if (shape === 'l-shape-bottom-right') return 'polygon(0% 0%, 100% 0%, 100% 50%, 50% 50%, 50% 100%, 0% 100%)';
  if (shape === 'u-shape') return 'polygon(0% 0%, 25% 0%, 25% 50%, 75% 50%, 75% 0%, 100% 0%, 100% 100%, 0% 100%)';
  return 'none';
};

const getRoomShapeMeshes = (shape, width, depth) => {
  switch (shape) {
    case 'l-shape':
      return {
        floors: [
          { x: width / 2, z: depth * 0.75, w: width, d: depth / 2 },
          { x: width / 4, z: depth / 4, w: width / 2, d: depth / 2 },
        ],
        walls: [
          { x: width / 4, z: 0, w: width / 2, d: 0.2 },
          { x: width / 2, z: depth / 4, w: 0.2, d: depth / 2 },
          { x: width * 0.75, z: depth / 2, w: width / 2, d: 0.2 },
          { x: 0, z: depth / 2, w: 0.2, d: depth },
        ],
      };
    case 'l-shape-mirror':
      return {
        floors: [
          { x: width / 2, z: depth * 0.75, w: width, d: depth / 2 },
          { x: width * 0.75, z: depth / 4, w: width / 2, d: depth / 2 },
        ],
        walls: [
          { x: width * 0.75, z: 0, w: width / 2, d: 0.2 },
          { x: width / 2, z: depth / 4, w: 0.2, d: depth / 2 },
          { x: width / 4, z: depth / 2, w: width / 2, d: 0.2 },
          { x: 0, z: depth * 0.75, w: 0.2, d: depth / 2 },
        ],
      };
    case 'l-shape-bottom-left':
      return {
        floors: [
          { x: width / 2, z: depth / 4, w: width, d: depth / 2 },
          { x: width * 0.75, z: depth * 0.75, w: width / 2, d: depth / 2 },
        ],
        walls: [
          { x: width / 2, z: 0, w: width, d: 0.2 },
          { x: 0, z: depth / 4, w: 0.2, d: depth / 2 },
          { x: width / 4, z: depth / 2, w: width / 2, d: 0.2 },
          { x: width / 2, z: depth * 0.75, w: 0.2, d: depth / 2 },
        ],
      };
    case 'l-shape-bottom-right':
      return {
        floors: [
          { x: width / 2, z: depth / 4, w: width, d: depth / 2 },
          { x: width / 4, z: depth * 0.75, w: width / 2, d: depth / 2 },
        ],
        walls: [
          { x: width / 2, z: 0, w: width, d: 0.2 },
          { x: 0, z: depth / 2, w: 0.2, d: depth },
          { x: width * 0.75, z: depth / 2, w: width / 2, d: 0.2 },
          { x: width / 2, z: depth * 0.75, w: 0.2, d: depth / 2 },
        ],
      };
    case 'u-shape':
      return {
        floors: [
          { x: width / 2, z: depth * 0.75, w: width, d: depth / 2 },
          { x: width / 8, z: depth / 4, w: width / 4, d: depth / 2 },
          { x: width * 0.875, z: depth / 4, w: width / 4, d: depth / 2 },
        ],
        walls: [
          { x: width / 8, z: 0, w: width / 4, d: 0.2 },
          { x: width * 0.875, z: 0, w: width / 4, d: 0.2 },
          { x: 0, z: depth / 2, w: 0.2, d: depth },
          { x: width / 4, z: depth / 4, w: 0.2, d: depth / 2 },
          { x: width / 2, z: depth / 2, w: width / 2, d: 0.2 },
          { x: width * 0.75, z: depth / 4, w: 0.2, d: depth / 2 },
        ],
      };
    default:
      return {
        floors: [{ x: width / 2, z: depth / 2, w: width, d: depth }],
        walls: [
          { x: width / 2, z: 0, w: width, d: 0.2 },
          { x: 0, z: depth / 2, w: 0.2, d: depth },
        ],
      };
  }
};

const isPointInsideRoomShape = (shape, width, depth, x, z) => {
  if (x < 0 || z < 0 || x > width || z > depth) return false;

  switch (shape) {
    case 'l-shape':
      return z >= depth / 2 || x <= width / 2;
    case 'l-shape-mirror':
      return z >= depth / 2 || x >= width / 2;
    case 'l-shape-bottom-left':
      return z <= depth / 2 || x >= width / 2;
    case 'l-shape-bottom-right':
      return z <= depth / 2 || x <= width / 2;
    case 'u-shape':
      return z >= depth / 2 || x <= width / 4 || x >= width * 0.75;
    default:
      return true;
  }
};

const isPlacementInsideRoomShape = (shape, width, depth, x, z, itemWidth, itemDepth) => {
  const epsilon = 0.0001;

  return [
    [x + epsilon, z + epsilon],
    [x + itemWidth - epsilon, z + epsilon],
    [x + epsilon, z + itemDepth - epsilon],
    [x + itemWidth - epsilon, z + itemDepth - epsilon],
  ].every(([pointX, pointZ]) => isPointInsideRoomShape(shape, width, depth, pointX, pointZ));
};

const ROOM_SIZE_PRESETS = [
  { id: 'custom', label: 'Custom Size', width: 12, depth: 12 },
  { id: 'compact-square', label: 'Compact Square (10 x 10 ft)', width: 10, depth: 10 },
  { id: 'compact-rect', label: 'Compact Rectangle (10 x 12 ft)', width: 10, depth: 12 },
  { id: 'medium-square', label: 'Medium Square (12 x 12 ft)', width: 12, depth: 12 },
  { id: 'medium-rect', label: 'Medium Rectangle (12 x 14 ft)', width: 12, depth: 14 },
  { id: 'large-rect', label: 'Large Rectangle (14 x 16 ft)', width: 14, depth: 16 },
  { id: 'master-suite', label: 'Master Suite (16 x 18 ft)', width: 16, depth: 18 },
  { id: 'studio-loft', label: 'Studio Loft (18 x 20 ft)', width: 18, depth: 20 },
];


function Design() {


  const [roomConfig, setRoomConfig] = useState({
    width: 12, depth: 12,
    wallColor: '#eeeeee', floorColor: '#cccccc',
    globalShade: 0.8,
    roomShape: 'rectangle'
  });
  const [selectedRoomPreset, setSelectedRoomPreset] = useState('custom');

  const [items, setItems] = useState([]);

  // Undo/Redo History States
  const [history, setHistory] = useState([[]]); // Stores array of 'items' arrays
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [viewMode, setViewMode] = useState('2D');
  const [dragItem, setDragItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, z: 0 });
  const [notification, setNotification] = useState(null); // Feedback message
  const [copiedItems, setCopiedItems] = useState([]);
  const roomRef = useRef(null);
  const dragStartPositionsRef = useRef({});
  const dragBlockedReasonRef = useRef(null);
  const nextItemIdRef = useRef(1);
  const [designName, setDesignName] = useState("");
  const { id } = useParams();

  const handleRoomPresetChange = (presetId) => {
    const selectedPreset = ROOM_SIZE_PRESETS.find((preset) => preset.id === presetId);
    if (!selectedPreset) return;

    setSelectedRoomPreset(presetId);
    if (presetId !== 'custom') {
      setRoomConfig((prev) => ({
        ...prev,
        width: selectedPreset.width,
        depth: selectedPreset.depth,
      }));
    }
  };

  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  }

  function showPlacementAlert(msg) {
    showNotification(msg);
    window.alert(msg);
  }

  const getValidItemPosition = (type) => {
    const candidatePositions = [
      { x: roomConfig.width / 2 - type.w / 2, z: roomConfig.depth / 2 - type.d / 2 },
      { x: roomConfig.width / 2 - type.w / 2, z: roomConfig.depth * 0.75 - type.d / 2 },
      { x: roomConfig.width / 2 - type.w / 2, z: roomConfig.depth * 0.25 - type.d / 2 },
      { x: roomConfig.width * 0.25 - type.w / 2, z: roomConfig.depth / 2 - type.d / 2 },
      { x: roomConfig.width * 0.75 - type.w / 2, z: roomConfig.depth / 2 - type.d / 2 },
      { x: roomConfig.width * 0.25 - type.w / 2, z: roomConfig.depth * 0.75 - type.d / 2 },
      { x: roomConfig.width * 0.75 - type.w / 2, z: roomConfig.depth * 0.75 - type.d / 2 },
    ];

    return candidatePositions
      .map((position) => ({
        x: Math.max(0, Math.min(position.x, roomConfig.width - type.w)),
        z: Math.max(0, Math.min(position.z, roomConfig.depth - type.d)),
      }))
      .find(
        (position) =>
          isPlacementInsideRoomShape(
            roomConfig.roomShape,
            roomConfig.width,
            roomConfig.depth,
            position.x,
            position.z,
            type.w,
            type.d,
          ) && !checkCollision(null, position.x, position.z, type.w, type.d)
      );
  };

  

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

          const loadedIds = (loadedData.items || [])
            .map((item) => Number(item.id))
            .filter((value) => Number.isFinite(value));
          nextItemIdRef.current = loadedIds.length ? Math.max(...loadedIds) + 1 : 1;

          if (loadedData.roomConfig) {
            setRoomConfig({ roomShape: 'rectangle', ...loadedData.roomConfig });

            const matchedPreset = ROOM_SIZE_PRESETS.find(
              (preset) =>
                preset.width === loadedData.roomConfig.width &&
                preset.depth === loadedData.roomConfig.depth
            );

            if (matchedPreset) {
              setSelectedRoomPreset(matchedPreset.id);
            }
          }

          // SAVE THE NAME TO STATE
          setDesignName(loadedData.name);

          showNotification("Design loaded");
        } else {
          showNotification("Error loading design");
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

  // Simulate Save to Database (Local Storage for now)
  const handleSaveDesign = async () => {
    const storedUserId = sessionStorage.getItem("userId");

    if (!storedUserId) {
      alert("Please log in to save your design.");
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
    const validPosition = getValidItemPosition(type);
    if (!validPosition) {
      showPlacementAlert("Furniture items cannot be placed on top of each other.");
      return;
    }

    const newItem = {
      id: nextItemIdRef.current++,
      type: type.name,
      x: validPosition.x,
      z: validPosition.z,
      w: type.w, d: type.d, h: type.h,
      color: type.color,
      rotation: 0
    };
    const newItems = [...items, newItem];
    saveToHistory(newItems); // Push to history
      setSelectedIds(new Set([newItem.id]));
  };
  const updateSelectedItem = (key, value) => {
     const focusedId = selectedIds.size === 1 ? [...selectedIds][0] : null;
     if (!focusedId) return;
     const newItems = items.map(item => item.id === focusedId ? { ...item, [key]: value } : item);
     saveToHistory(newItems);
  };

  const deleteSelectedItem = () => {
     if (selectedIds.size === 0) return;
     const count = selectedIds.size;
     const newItems = items.filter(i => !selectedIds.has(i.id));
    saveToHistory(newItems);
     setSelectedIds(new Set());
     showNotification(count > 1 ? `${count} items deleted` : "Item deleted");
  }

  const handleCopySelectedItem = () => {
      if (selectedIds.size === 0) {
        showNotification("Select items to copy");
      return;
    }
      const toCopy = items.filter(i => selectedIds.has(i.id));
      setCopiedItems(toCopy.map(i => ({ ...i })));
      showNotification(toCopy.length > 1 ? `${toCopy.length} items copied` : "Item copied");
  };

  const handlePasteItem = () => {
      if (!copiedItems || copiedItems.length === 0) {
        showNotification("Nothing to paste");
      return;
    }
      let placed = null;
      for (let step = 1; step <= 25; step++) {
        const offset = step * 0.5;
        const candidates = copiedItems.map(item => ({
          ...item,
          x: Math.max(0, Math.min(item.x + offset, roomConfig.width - item.w)),
          z: Math.max(0, Math.min(item.z + offset, roomConfig.depth - item.d)),
        }));
        const allFit = candidates.every(candidate => {
          if (!isPlacementInsideRoomShape(roomConfig.roomShape, roomConfig.width, roomConfig.depth, candidate.x, candidate.z, candidate.w, candidate.d)) {
            return false;
          }
          for (const existing of items) {
            if (
              candidate.x < existing.x + existing.w && candidate.x + candidate.w > existing.x &&
              candidate.z < existing.z + existing.d && candidate.z + candidate.d > existing.z
            ) return false;
          }
          for (const other of candidates) {
            if (other === candidate) continue;
            if (
              candidate.x < other.x + other.w && candidate.x + candidate.w > other.x &&
              candidate.z < other.z + other.d && candidate.z + candidate.d > other.z
            ) return false;
          }
          return true;
        });
        if (allFit) { placed = candidates; break; }
      }
      if (!placed) {
        showPlacementAlert("Furniture items cannot be placed on top of each other.");
        return;
      }
      const newPastedItems = placed.map(item => ({ ...item, id: nextItemIdRef.current++ }));
      const newItems = [...items, ...newPastedItems];
    saveToHistory(newItems);
      setSelectedIds(new Set(newPastedItems.map(i => i.id)));
      showNotification(newPastedItems.length > 1 ? `${newPastedItems.length} items pasted` : "Item pasted");
  };

  const handleShadeChange = (amount) => {
      const focusedId = selectedIds.size === 1 ? [...selectedIds][0] : null;
      const item = items.find(i => i.id === focusedId);
      if (focusedId && item) {
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

      let newSelectedIds;
      let shouldDrag = true;

      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(item.id)) {
          newSelectedIds.delete(item.id);
          shouldDrag = false;
        } else {
          newSelectedIds.add(item.id);
        }
      } else {
        newSelectedIds = selectedIds.has(item.id) ? selectedIds : new Set([item.id]);
      }

      setSelectedIds(newSelectedIds);

      if (shouldDrag) {
        const startPositions = {};
        for (const i of items) {
          if (newSelectedIds.has(i.id)) startPositions[i.id] = { x: i.x, z: i.z };
        }
        dragStartPositionsRef.current = startPositions;
        dragBlockedReasonRef.current = null;
        setDragOffset({ x: mouseX - item.x, z: mouseZ - item.z });
        setDragItem(item.id);
      }
  };
  const handleMouseMove = (e) => {
    if (!dragItem || viewMode !== '2D' || !roomRef.current) return;

    const container = roomRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - container.left) / 40;
    const mouseZ = (e.clientY - container.top) / 40;

      const startPositions = dragStartPositionsRef.current;
      const anchorStart = startPositions[dragItem];
      if (!anchorStart) return;

      const desiredX = mouseX - dragOffset.x;
      const desiredZ = mouseZ - dragOffset.z;
      let deltaX = desiredX - anchorStart.x;
      let deltaZ = desiredZ - anchorStart.z;

      const selectedItemsList = items.filter(i => selectedIds.has(i.id));

      // Clamp delta so every selected item stays within room bounds
      for (const sel of selectedItemsList) {
        const start = startPositions[sel.id];
        if (!start) continue;
        deltaX = Math.max(-start.x, Math.min(roomConfig.width - sel.w - start.x, deltaX));
        deltaZ = Math.max(-start.z, Math.min(roomConfig.depth - sel.d - start.z, deltaZ));
      }

      // Collision: only test selected items against non-selected items
      const collidesWithFixed = (x, z, w, d) => {
        for (const it of items) {
          if (selectedIds.has(it.id)) continue;
          if (x < it.x + it.w && x + w > it.x && z < it.z + it.d && z + d > it.z) return true;
        }
        return false;
      };

      const buildCandidates = (dx, dz) => selectedItemsList.map(sel => {
        const start = startPositions[sel.id];
        return { id: sel.id, x: start ? start.x + dx : sel.x, z: start ? start.z + dz : sel.z, w: sel.w, d: sel.d };
      });
      const anyCollision = (candidates) => candidates.some(c => collidesWithFixed(c.x, c.z, c.w, c.d));
      const anyOutsideShape = (candidates) => candidates.some(c => !isPlacementInsideRoomShape(roomConfig.roomShape, roomConfig.width, roomConfig.depth, c.x, c.z, c.w, c.d));
      const desiredCandidates = buildCandidates(deltaX, deltaZ);
      const desiredCollision = anyCollision(desiredCandidates);
      const desiredOutsideShape = anyOutsideShape(desiredCandidates);

      if (desiredCollision) {
        dragBlockedReasonRef.current = 'collision';
      } else if (!dragBlockedReasonRef.current && desiredOutsideShape) {
        dragBlockedReasonRef.current = 'shape';
      }

      let finalCandidates = null;
      if (!desiredCollision && !desiredOutsideShape) {
        finalCandidates = desiredCandidates;
      } else if (!anyCollision(buildCandidates(deltaX, 0)) && !anyOutsideShape(buildCandidates(deltaX, 0))) {
        finalCandidates = buildCandidates(deltaX, 0);
      } else if (!anyCollision(buildCandidates(0, deltaZ)) && !anyOutsideShape(buildCandidates(0, deltaZ))) {
        finalCandidates = buildCandidates(0, deltaZ);
      }

      if (finalCandidates) {
        const posMap = {};
        finalCandidates.forEach(c => { posMap[c.id] = { x: c.x, z: c.z }; });
        setItems(items.map(i => posMap[i.id] ? { ...i, ...posMap[i.id] } : i));
      }

    };

  const handleMouseUp = () => {
    if (dragItem) {
      // Save to history only after drag ends
      saveToHistory(items);
      if (dragBlockedReasonRef.current === 'collision') {
        showPlacementAlert("Furniture items cannot be placed on top of each other.");
      }
      dragBlockedReasonRef.current = null;
      setDragItem(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target?.tagName;
      const isTypingField = targetTag === 'INPUT' || targetTag === 'TEXTAREA' || event.target?.isContentEditable;

      if (isTypingField) return;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        handleCopySelectedItem();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'v') {
        event.preventDefault();
        handlePasteItem();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, copiedItems, items, roomConfig.width, roomConfig.depth]);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.design-scroll-reveal:not(.visible)');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [selectedIds.size, viewMode]);

  const editItem = selectedIds.size === 1 ? items.find(i => i.id === [...selectedIds][0]) : null;
  const roomShapeMeshes = getRoomShapeMeshes(roomConfig.roomShape, roomConfig.width, roomConfig.depth);
  return (
    <>
      <TopNav />

      <div className="design-page">

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="design-notification">
            {notification}
          </div>
        )}

        {/* SIDEBAR */}
        <aside className="design-sidebar design-scroll-reveal">
        <h2 className="design-title design-scroll-reveal">
          <BiCube className="design-title-icon" />
          <span>Furniture Planner</span>
        </h2>

        {/* GLOBAL ACTIONS (Undo/Redo/Save) */}
        <div className="design-actions-row design-scroll-reveal">
          <button onClick={handleUndo} disabled={historyIndex === 0} className={historyIndex === 0 ? 'disabledBtn' : 'actionBtn'}>
            <HiOutlineArrowUturnLeft className="design-button-icon" />
            <span>Undo</span>
          </button>
          <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className={historyIndex === history.length - 1 ? 'disabledBtn' : 'actionBtn'}>
            <HiOutlineArrowUturnRight className="design-button-icon" />
            <span>Redo</span>
          </button>
          <button onClick={handleSaveDesign} className="actionBtn primary">
            <FiSave className="design-button-icon" />
            <span>Save</span>
          </button>
          <button onClick={handleCopySelectedItem} className={selectedIds.size > 0 ? 'actionBtn' : 'disabledBtn'} disabled={selectedIds.size === 0} title="Ctrl+C">
            <span>Copy</span>
          </button>
          <button onClick={handlePasteItem} className={copiedItems.length > 0 ? 'actionBtn' : 'disabledBtn'} disabled={copiedItems.length === 0} title="Ctrl+V">
            <span>Paste</span>
          </button>
        </div>

        {/* 1. Global Settings */}
        <div className="cardStyle design-scroll-reveal">
          <h3 className="headingStyle">1. Room Settings</h3>
          <div className="rowStyle">
            <label>Room Size:</label>
            <select
              value={selectedRoomPreset}
              onChange={e => handleRoomPresetChange(e.target.value)}
              className="inputStyle"
              style={{ width: '100%' }}
            >
              {ROOM_SIZE_PRESETS.map(preset => (
                <option key={preset.id} value={preset.id}>{preset.label}</option>
              ))}
            </select>
          </div>

          <div className="rowStyle">
            <label>Room Shape:</label>
            <select
              value={roomConfig.roomShape}
              onChange={e => setRoomConfig({ ...roomConfig, roomShape: e.target.value })}
              className="inputStyle"
              style={{ width: '100%' }}
            >
              {ROOM_SHAPE_OPTIONS.map(shape => (
                <option key={shape.id} value={shape.id}>{shape.label}</option>
              ))}
            </select>
          </div>

          <div className="rowStyle"> <label>Width (ft):</label> <input type="number" value={roomConfig.width} min={6} max={30} className="inputStyle" disabled={selectedRoomPreset !== 'custom'} onChange={e => { if (selectedRoomPreset === 'custom') setRoomConfig({ ...roomConfig, width: Math.min(30, Math.max(6, Number(e.target.value))) }); }} /> </div>
          <div className="rowStyle"> <label>Depth (ft):</label> <input type="number" value={roomConfig.depth} min={6} max={30} className="inputStyle" disabled={selectedRoomPreset !== 'custom'} onChange={e => { if (selectedRoomPreset === 'custom') setRoomConfig({ ...roomConfig, depth: Math.min(30, Math.max(6, Number(e.target.value))) }); }} /> </div>

          <div className="rowStyle"> <label>Walls:</label> <input type="color" value={roomConfig.wallColor} onChange={e => setRoomConfig({ ...roomConfig, wallColor: e.target.value })} /> </div>
          <div className="rowStyle"> <label>Floor:</label> <input type="color" value={roomConfig.floorColor} onChange={e => setRoomConfig({ ...roomConfig, floorColor: e.target.value })} /> </div>

          <div className="rangeBlock">
            <label className="rangeLabel">Lighting Intensity:</label>
            <input type="range" min="0.1" max="2" step="0.1" value={roomConfig.globalShade} onChange={e => setRoomConfig({ ...roomConfig, globalShade: Number(e.target.value) })} className="rangeInput" />
          </div>
        </div>

        {/* 2. Add Furniture */}
        <div className="cardStyle design-scroll-reveal">
          <h3 className="headingStyle">2. Catalog</h3>
          <div className="catalogGrid">
            {FURNITURE_TYPES.map(type => {
              const FurnitureIcon = type.icon;

              return (
              <button key={type.name} onClick={() => addItem(type)} className="addItemBtn">
                <FurnitureIcon className="catalogIcon" />
                <span>{type.name}</span>
              </button>
              );
            })}
          </div>
        </div>

        {/* 3. Selected Item Settings */}
          {editItem ? (
          <div className="cardStyle selectedCard design-scroll-reveal">
              <h3 className="headingStyle">3. Edit: {editItem.type}</h3>

            <div className="rowStyle">
              <label>Color:</label>
                <input type="color" value={editItem.color} onChange={e => updateSelectedItem('color', e.target.value)} />
            </div>

            <div className="shadeBlock">
              <label className="miniLabel">Shade / Brightness:</label>
              <div className="shadeButtons">
                <button onClick={() => handleShadeChange(-10)} className="smallBtn">Darker</button>
                <button onClick={() => handleShadeChange(10)} className="smallBtn">Lighter</button>
              </div>
            </div>

            <label className="miniLabel">Rotation:</label>
            <input type="range" min="0" max="360" step="15"
                value={editItem.rotation * (180 / Math.PI)}
              onChange={e => updateSelectedItem('rotation', e.target.value * (Math.PI / 180))}
              className="rangeInput" />

              <div className="rowStyle"><label>W:</label> <input type="range" min="0.5" max="6" step="0.1" value={editItem.w} onChange={e => updateSelectedItem('w', Number(e.target.value))} className="rangeInputShort" /></div>
              <div className="rowStyle"><label>D:</label> <input type="range" min="0.5" max="6" step="0.1" value={editItem.d} onChange={e => updateSelectedItem('d', Number(e.target.value))} className="rangeInputShort" /></div>

            <button onClick={deleteSelectedItem} className="actionBtn danger">Delete Item</button>
          </div>
          ) : selectedIds.size > 1 ? (
            <div className="cardStyle selectedCard design-scroll-reveal">
              <h3 className="headingStyle">3. {selectedIds.size} Items Selected</h3>
              <p style={{ fontSize: '12px', color: '#b9afb0', marginBottom: '10px' }}>Drag any selected item to move all together.</p>
              <button onClick={deleteSelectedItem} className="actionBtn danger">Delete All Selected</button>
            </div>
          ) : (
            <div className="emptyState design-scroll-reveal">
              Select an item to edit
              <br />
              <span style={{ fontSize: '11px', opacity: 0.6 }}>Hold Ctrl to multi-select</span>
            </div>
        )}
        </aside>

        {/* CANVAS AREA */}
        <section className="design-canvas-area design-scroll-reveal">
        <div className="design-view-tabs design-scroll-reveal">
          <button onClick={() => setViewMode('2D')} className={viewMode === '2D' ? 'activeTabStyle' : 'tabStyle'}>
            <BsGrid3X3 className="design-tab-icon" />
            <span>2D Plan</span>
          </button>
          <button onClick={() => setViewMode('3D')} className={viewMode === '3D' ? 'activeTabStyle' : 'tabStyle'}>
            <BiCube className="design-tab-icon" />
            <span>3D View</span>
          </button>
        </div>

        <div className="design-canvas-shell design-scroll-reveal">

          {/* 2D VIEW */}
          {viewMode === '2D' && (
            <div
              onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
              className="planner2dWrap"
              style={{ cursor: dragItem ? 'grabbing' : 'default' }}
            >
              {/* Room Container */}
              <div ref={roomRef} className="room2d" style={{ width: `${roomConfig.width * 40}px`, height: `${roomConfig.depth * 40}px`, border: `8px solid ${roomConfig.wallColor}`, clipPath: getRoomClipPath(roomConfig.roomShape) }}>
                {/* Grid Background */}
                <div className="room2dGrid"></div>

                {/* Room Size Labels */}
                <div className="room2dLabel room2dLabelTop">{roomConfig.width} ft</div>
                <div className="room2dLabel room2dLabelSide">{roomConfig.depth} ft</div>

                {items.map(item => (
                  <div key={item.id} onMouseDown={(e) => handleMouseDown(e, item)}
                    style={{
                      position: 'absolute',
                      left: `${item.x * 40}px`, top: `${item.z * 40}px`,
                      width: `${item.w * 40}px`, height: `${item.d * 40}px`,
                      backgroundColor: item.color,
                        border: selectedIds.has(item.id) ? '2px solid #ded2d3' : '1px solid rgba(10, 10, 10, 0.65)',
                      zIndex: 10, cursor: 'grab',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px',
                      transform: `rotate(${item.rotation}rad)`,
                      transformOrigin: 'center center',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.22)'
                    }}>
                    <div style={{ width: '100%', height: '100%', borderTop: '2px solid rgba(0,0,0,0.2)' }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3D VIEW */}
          {viewMode === '3D' && (
            // 1. Set shadows="soft". This makes edges smooth automatically.
            <Canvas camera={{ position: [20, 25, 20], fov: 40 }} shadows="soft" dpr={[1, 9]} style={{ background: '#d2d0cb' }}>
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
                {roomShapeMeshes.floors.map((floor, index) => (
                  <mesh key={`floor-${index}`} rotation={[-Math.PI / 2, 0, 0]} position={[floor.x, -0.01, floor.z]} receiveShadow>
                    <planeGeometry args={[floor.w, floor.d]} />
                    <meshStandardMaterial color={roomConfig.floorColor} roughness={0.8} />
                  </mesh>
                ))}

                {/* Walls */}
                {roomShapeMeshes.walls.map((wall, index) => (
                  <mesh key={`wall-${index}`} position={[wall.x, 4, wall.z]} receiveShadow>
                    <boxGeometry args={[wall.w, 8, wall.d]} />
                    <meshStandardMaterial color={roomConfig.wallColor} />
                  </mesh>
                ))}

                {/* Furniture Items */}
                {items.map(item => (
                  <group key={item.id} position={[item.x + item.w / 2, 0, item.z + item.d / 2]} rotation={[0, -item.rotation, 0]}>
                    {/* Floating Label */}
                      {selectedIds.has(item.id) && (
                      <Html position={[0, item.h + 0.5, 0]} center>
                        <div className="selectedLabel3d">Selected</div>
                      </Html>
                    )}
                    {/* This is where the component is rendered in 3D */}
                    {item.type === 'Chair' && <Chair w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'Table' && <Table w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'Bed' && <Bed w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'Cupboard' && <Cupboard w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'Sofa' && <Sofa w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'Nightstand' && <Nightstand w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'DressingTable' && <DressingTable w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'BeanBag' && <BeanBag w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'Lamp' && <Lamp w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'TVStand' && <TVStand w={item.w} d={item.d} h={item.h} color={item.color} />}
                    {item.type === 'Rug' && <Rug w={item.w} d={item.d} color={item.color} />}
                  </group>
                ))}
              </group>
              <gridHelper args={[50, 50, 0xdddddd, 0xeeeeee]} position={[0, 0, 0]} />
            </Canvas>
          )}

        </div>
        </section>
      </div>
    </>
  )
}

export default Design
