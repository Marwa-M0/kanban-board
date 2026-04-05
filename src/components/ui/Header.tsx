"use client";

import { useUIStore } from "@/store/uiStore";
import { Search, LayoutDashboard, Plus } from "lucide-react";
import { useCallback } from "react";

export function Header() {
  const { searchQuery, setSearchQuery, openCreateModal } = useUIStore();

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [setSearchQuery]
  );

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <LayoutDashboard size={22} />
        <div>
          <h1 className="app-header__title">Kanban Board</h1>
          <p className="app-header__subtitle">Manage your workflow</p>
        </div>
      </div>

      <div className="app-header__controls">
        <div className="search-bar">
          <Search size={16} className="search-bar__icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar__input"
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button
              className="search-bar__clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <button className="btn btn--primary" onClick={() => openCreateModal()}>
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
