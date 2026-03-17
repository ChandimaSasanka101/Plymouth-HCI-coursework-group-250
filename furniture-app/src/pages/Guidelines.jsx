import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsGrid3X3 } from 'react-icons/bs';
import { BiCube } from 'react-icons/bi';
import { FiSave } from 'react-icons/fi';
import { HiOutlineArrowUturnLeft, HiOutlineArrowUturnRight } from 'react-icons/hi2';
import { MdChair, MdTouchApp, MdTune } from 'react-icons/md';

import TopNav from '../components/TopNav';
import './Guidelines.css';

const guideSteps = [
  {
    title: 'Open the planner',
    description: 'Use the DESIGN link in the navigation. If you are not logged in yet, the app will first take you to the login page.',
    details: ['Sign in or create an account.', 'Open DESIGN again after login.', 'You will land on the Furniture Planner page.'],
  },
  {
    title: 'Set up your room first',
    description: 'Start in the Room Settings card on the left side. This defines the working area before you place any furniture.',
    details: ['Pick a room size preset or keep Custom Size.', 'Choose the room shape such as Rectangle, L-Shape, or U-Shape.', 'Adjust width, depth, wall color, floor color, and lighting intensity.'],
  },
  {
    title: 'Add furniture from the catalog',
    description: 'Use the Catalog section to place items like chairs, tables, beds, cupboards, sofas, lamps, and rugs.',
    details: ['Click any catalog button once to add that item.', 'New items are placed automatically in the first available area.', 'If the room is too full, the app blocks overlapping placements.'],
  },
  {
    title: 'Arrange items in 2D Plan',
    description: 'Keep the 2D Plan tab active while you are laying out the room. This view is best for positioning items precisely.',
    details: ['Click an item to select it.', 'Drag the selected item to move it around the room.', 'Hold Ctrl and click multiple items to move them together.', 'The planner prevents items from overlapping or leaving the room shape.'],
  },
  {
    title: 'Edit the selected furniture',
    description: 'When one item is selected, the Edit card appears in the sidebar so you can refine it.',
    details: ['Change the item color.', 'Use Darker or Lighter to adjust shade.', 'Rotate the item with the rotation slider.', 'Resize width and depth with the range controls.', 'Use Delete Item if you no longer need it.'],
  },
  {
    title: 'Use copy, paste, undo, and redo',
    description: 'The action buttons at the top of the sidebar help you recover quickly and duplicate layouts.',
    details: ['Undo reverses the last change.', 'Redo reapplies a reversed change.', 'Copy works on the selected item or selected group.', 'Paste creates a new copy in the nearest free space.', 'Keyboard shortcuts Ctrl+C and Ctrl+V also work.'],
  },
  {
    title: 'Review the layout in 3D',
    description: 'Switch to 3D View to inspect how the room looks with perspective, lighting, and actual furniture models.',
    details: ['Use the 3D View tab above the canvas.', 'Drag in the 3D scene to orbit around the room.', 'Compare colors, spacing, and overall balance before saving.'],
  },
  {
    title: 'Save your design',
    description: 'When the layout is ready, click Save and enter a name for the design.',
    details: ['The app will prompt you for a design name.', 'Saving stores the room configuration and all placed items.', 'If you opened an existing design, Save updates that design.'],
  },
];

const quickTips = [
  'Set the room size and shape before adding many items.',
  'Use 2D Plan for editing and 3D View for reviewing.',
  'If you cannot place an item, free up space or move existing furniture first.',
  'Use multi-select with Ctrl when you want to move a small group together.',
];

function Guidelines() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(sessionStorage.getItem('userId'));
  const sectionRefs = useRef({});
  const [visibleSections, setVisibleSections] = useState({
    hero: false,
    overview: false,
    steps: false,
    actions: false,
    tips: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionKey = entry.target.dataset.section;

          setVisibleSections((current) => {
            if (current[sectionKey]) {
              return current;
            }

            return { ...current, [sectionKey]: true };
          });

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, []);

  const openDesign = () => {
    navigate(isLoggedIn ? '/design' : '/login');
  };

  return (
    <>
      <TopNav />

      <main className="guidelines-page">
        <section
          className={`guidelines-hero guidelines-section-reveal ${visibleSections.hero ? 'visible' : ''}`}
          data-section="hero"
          ref={(element) => {
            sectionRefs.current.hero = element;
          }}
        >
          <div className={`guidelines-hero-content guidelines-panel-reveal ${visibleSections.hero ? 'visible' : ''}`}>
            <p className="guidelines-eyebrow">DESIGN GUIDE</p>
            <h1>Learn the planner from zero</h1>
            <p className="guidelines-intro">
              This page walks a first-time user through the design tool step by step, from opening the planner to saving a finished room layout.
            </p>

            <div className="guidelines-hero-actions">
              <button className="guidelines-primary-btn" onClick={openDesign}>
                {isLoggedIn ? 'OPEN DESIGN PAGE' : 'LOGIN TO START'}
              </button>
              <button className="guidelines-secondary-btn" onClick={() => navigate('/home')}>
                BACK TO HOME
              </button>
            </div>
          </div>

          <div
            className={`guidelines-hero-panel guidelines-panel-reveal ${visibleSections.hero ? 'visible' : ''}`}
            style={{ transitionDelay: '0.14s' }}
          >
            <div className="guidelines-mini-card">
              <BsGrid3X3 className="guidelines-mini-icon" />
              <span>2D layout planning</span>
            </div>
            <div className="guidelines-mini-card">
              <MdChair className="guidelines-mini-icon" />
              <span>Furniture placement</span>
            </div>
            <div className="guidelines-mini-card">
              <MdTune className="guidelines-mini-icon" />
              <span>Color, size, rotation</span>
            </div>
            <div className="guidelines-mini-card">
              <BiCube className="guidelines-mini-icon" />
              <span>3D review mode</span>
            </div>
          </div>
        </section>

        <section
          className={`guidelines-overview guidelines-section-reveal ${visibleSections.overview ? 'visible' : ''}`}
          data-section="overview"
          ref={(element) => {
            sectionRefs.current.overview = element;
          }}
        >
          <div className="guidelines-overview-card">
            <h2>What you will see on the design page</h2>
            <div className="guidelines-overview-grid">
              <article style={{ transitionDelay: '0.05s' }}>
                <h3>Left sidebar</h3>
                <p>Contains Room Settings, Catalog, editing controls, and the main action buttons like Undo, Redo, Copy, Paste, and Save.</p>
              </article>
              <article style={{ transitionDelay: '0.14s' }}>
                <h3>Center workspace</h3>
                <p>Shows the room canvas where items are placed and arranged. The same layout can be viewed in both 2D and 3D.</p>
              </article>
              <article style={{ transitionDelay: '0.23s' }}>
                <h3>Top view tabs</h3>
                <p>Let you switch between 2D Plan for editing and 3D View for visual inspection.</p>
              </article>
            </div>
          </div>
        </section>

        <section
          className={`guidelines-steps-section guidelines-section-reveal ${visibleSections.steps ? 'visible' : ''}`}
          data-section="steps"
          ref={(element) => {
            sectionRefs.current.steps = element;
          }}
        >
          <div className="guidelines-section-heading">
            <p className="guidelines-eyebrow">STEP BY STEP</p>
            <h2>How to use the design page</h2>
          </div>

          <div className="guidelines-steps-grid">
            {guideSteps.map((step, index) => (
              <article key={step.title} className="guidelines-step-card" style={{ transitionDelay: `${0.08 * index}s` }}>
                <div className="guidelines-step-rail">
                  <div className="guidelines-step-number">{String(index + 1).padStart(2, '0')}</div>
                  <div className="guidelines-step-line" aria-hidden="true"></div>
                </div>
                <div className="guidelines-step-body">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <ul>
                    {step.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={`guidelines-actions-section guidelines-section-reveal ${visibleSections.actions ? 'visible' : ''}`}
          data-section="actions"
          ref={(element) => {
            sectionRefs.current.actions = element;
          }}
        >
          <div className="guidelines-section-heading">
            <p className="guidelines-eyebrow">IMPORTANT CONTROLS</p>
            <h2>What the main buttons do</h2>
          </div>

          <div className="guidelines-action-grid">
            <article className="guidelines-action-card" style={{ transitionDelay: '0.05s' }}>
              <HiOutlineArrowUturnLeft className="guidelines-action-icon" />
              <h3>Undo</h3>
              <p>Reverts the last change if you moved, edited, added, or removed something by mistake.</p>
            </article>
            <article className="guidelines-action-card" style={{ transitionDelay: '0.14s' }}>
              <HiOutlineArrowUturnRight className="guidelines-action-icon" />
              <h3>Redo</h3>
              <p>Restores an action that was just undone.</p>
            </article>
            <article className="guidelines-action-card" style={{ transitionDelay: '0.23s' }}>
              <MdTouchApp className="guidelines-action-icon" />
              <h3>Select and Drag</h3>
              <p>Click an item to select it, then drag it inside the room boundaries to reposition it.</p>
            </article>
            <article className="guidelines-action-card" style={{ transitionDelay: '0.32s' }}>
              <FiSave className="guidelines-action-icon" />
              <h3>Save</h3>
              <p>Prompts for a design name and stores the current room and furniture arrangement.</p>
            </article>
          </div>
        </section>

        <section
          className={`guidelines-tips-section guidelines-section-reveal ${visibleSections.tips ? 'visible' : ''}`}
          data-section="tips"
          ref={(element) => {
            sectionRefs.current.tips = element;
          }}
        >
          <div className="guidelines-tips-card">
            <p className="guidelines-eyebrow">QUICK TIPS</p>
            <h2>Best way to get a clean result</h2>
            <ul>
              {quickTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </>
  );
}

export default Guidelines;