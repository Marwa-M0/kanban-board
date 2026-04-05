"use client";

import { useUIStore } from "@/store/uiStore";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { ColumnId, Priority, COLUMNS } from "@/types";
import { X } from "lucide-react";
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Dialog
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#4f8ef7" },
    background: { paper: "#161b27", default: "#0f1117" },
  },
});

export function TaskModal() {
  const { taskModal, closeModal } = useUIStore();
  const { isOpen, mode, task, defaultColumn } = taskModal;
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const column = data.get("column") as ColumnId;
    const priority = data.get("priority") as Priority;

    if (mode === "create") {
      await createTask.mutateAsync({ title, description, column, priority });
    } else if (task) {
      await updateTask.mutateAsync({
        id: task.id,
        input: { title, description, column, priority },
      });
    }

    closeModal();
  };

  const isPending = createTask.isPending || updateTask.isPending;

  return (
    <Dialog 
      open={isOpen} 
      onClose={closeModal}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          backgroundImage: "none",
          overflow: "visible",
        }
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <div className="modal__content" key={task?.id ?? "new"}>
          {/* Header */}
          <div className="modal__header">
            <h2 className="modal__title">
              {mode === "create" ? "New Task" : "Edit Task"}
            </h2>
            <button className="modal__close" onClick={closeModal} aria-label="Close" type="button">
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="modal__form">
            <TextField
              label="Title"
              name="title"
              fullWidth
              required
              defaultValue={task?.title ?? ""}
              placeholder="Task title..."
              variant="outlined"
              size="small"
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              defaultValue={task?.description ?? ""}
              placeholder="Add a description..."
              variant="outlined"
              size="small"
              slotProps={{
                inputLabel: { shrink: true }
              }}
            />

            <div className="form-row">
              <FormControl fullWidth size="small">
                <InputLabel id="column-label">Column</InputLabel>
                <Select
                  labelId="column-label"
                  id="column"
                  name="column"
                  defaultValue={task?.column ?? defaultColumn ?? "backlog"}
                  label="Column"
                  required
                >
                  {COLUMNS.map((col) => (
                    <MenuItem key={col.id} value={col.id}>
                      {col.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  defaultValue={task?.priority ?? "medium"}
                  label="Priority"
                  required
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="modal__actions">
              <button
                type="button"
                onClick={closeModal}
                className="btn btn--secondary"
                disabled={isPending}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={isPending}>
                {isPending ? "Saving..." : mode === "create" ? "Create Task" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </ThemeProvider>
    </Dialog>
  );
}
