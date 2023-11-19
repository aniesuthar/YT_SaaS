import React from 'react'
import ProjectBoxes from './ProjectBoxes'

export default function ProjectsSection() {
  return (
      <div className="dashboard-container">
          <div className="dashboard-container-header">
              <p>Video Explorer</p>
              <p className="time">December, 12</p>
          </div>
          <div className="dashboard-container-line">
              <div className="projects-status">
                  <div className="item-status">
                      <span className="status-number">45</span>
                      <span className="status-type">In Progress</span>
                  </div>
                  <div className="item-status">
                      <span className="status-number">24</span>
                      <span className="status-type">Upcoming</span>
                  </div>
                  <div className="item-status">
                      <span className="status-number">62</span>
                      <span className="status-type">Total Projects</span>
                  </div>
              </div>
              <div className="view-actions">
                  <button className="view-btn list-view" title="List View">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-list"
                      >
                          <line x1={8} y1={6} x2={21} y2={6} />
                          <line x1={8} y1={12} x2={21} y2={12} />
                          <line x1={8} y1={18} x2={21} y2={18} />
                          <line x1={3} y1={6} x2="3.01" y2={6} />
                          <line x1={3} y1={12} x2="3.01" y2={12} />
                          <line x1={3} y1={18} x2="3.01" y2={18} />
                      </svg>
                  </button>
                  <button className="view-btn grid-view active" title="Grid View">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={20}
                          height={20}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-grid"
                      >
                          <rect x={3} y={3} width={7} height={7} />
                          <rect x={14} y={3} width={7} height={7} />
                          <rect x={14} y={14} width={7} height={7} />
                          <rect x={3} y={14} width={7} height={7} />
                      </svg>
                  </button>
              </div>
          </div>
          <ProjectBoxes />
      </div>
  )
}
