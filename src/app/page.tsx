import { KanbanBoard } from "@/components/board/KanbanBoard";
import { Header } from "@/components/ui/Header";
import { TaskModal } from "@/components/tasks/TaskModal";
import { ApiStatusBanner } from "@/components/ui/ApiStatusBanner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { DeleteConfirmDialog } from "@/components/tasks/DeleteConfirmDialog";

export default function HomePage() {
  return (
    <main className="app-layout">
      <Header />
      <ApiStatusBanner />
      <ErrorBoundary>
        <div className="board-container">
          <KanbanBoard />
        </div>
      </ErrorBoundary>
      <TaskModal />
      <DeleteConfirmDialog />
    </main>
  );
}
