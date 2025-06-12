// utils/confirmDialog.ts
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

export interface ConfirmDialogOptions {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    icon?: 'warning' | 'info' | 'success' | 'error' | 'question';
    confirmButtonColor?: string;
    cancelButtonColor?: string;
}

export const confirmDialog = async ({
                                        title = 'Are you sure?',
                                        text = 'This action cannot be undone.',
                                        confirmButtonText = 'Yes',
                                        cancelButtonText = 'Cancel',
                                        icon = 'warning',
                                        confirmButtonColor = '#e11d48', // red-600
                                        cancelButtonColor = '#6b7280',  // gray-500
                                    }: ConfirmDialogOptions = {}): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor,
        cancelButtonColor,
    });

    return result.isConfirmed;
};
