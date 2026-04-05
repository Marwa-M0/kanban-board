"use client";

import { useUIStore } from "@/store/uiStore";
import { useDeleteTask } from "@/hooks/useTasks";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  ThemeProvider,
  createTheme
} from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#ef4444" }, // Red for delete
    background: { paper: "#161b27", default: "#0f1117" },
  },
});

export function DeleteConfirmDialog() {
  const { deleteConfirmation, closeDeleteConfirmation } = useUIStore();
  const deleteTask = useDeleteTask();

  const handleConfirm = () => {
    if (deleteConfirmation.taskId) {
      deleteTask.mutate(deleteConfirmation.taskId);
    }
    closeDeleteConfirmation();
  };

  return (
    <Dialog 
      open={deleteConfirmation.isOpen} 
      onClose={closeDeleteConfirmation}
      PaperProps={{
        sx: {
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          backgroundImage: "none",
        }
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <DialogTitle sx={{ color: "var(--text-primary)", pb: 1 }}>
          Delete Task?
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
            Are you sure you want to delete <strong>&quot;{deleteConfirmation.taskTitle}&quot;</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={closeDeleteConfirmation} 
            sx={{ color: "var(--text-secondary)" }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            variant="contained" 
            color="primary"
            sx={{ borderRadius: "var(--radius-sm)" }}
          >
            Delete
          </Button>
        </DialogActions>
      </ThemeProvider>
    </Dialog>
  );
}
