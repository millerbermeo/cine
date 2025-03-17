export const showToast = (message, type = "success") => {
    Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: type, // 'success', 'error', 'warning', 'info'
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true, // Barra de progreso
        background:
            type === "success"
                ? "#d1fae5"
                : type === "error"
                    ? "#fee2e2"
                    : type === "warning"
                        ? "#fef3c7"
                        : "#bfdbfe",
        color:
            type === "success"
                ? "#065f46"
                : type === "error"
                    ? "#b91c1c"
                    : type === "warning"
                        ? "#92400e"
                        : "#1e3a8a",
        iconColor:
            type === "success"
                ? "#10b981"
                : type === "error"
                    ? "#ef4444"
                    : type === "warning"
                        ? "#f59e0b"
                        : "#3b82f6",
        customClass: {
            popup: "rounded-lg shadow-lg text-lg px-4 py-2",
            title: "font-semibold",
        },
        showClass: {
            popup: "animate__animated animate__fadeInUp",
        },
        hideClass: {
            popup: "animate__animated animate__fadeOutDown",
        },
    });
};