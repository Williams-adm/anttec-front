import Swal from "sweetalert2";

type sweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

interface sweetAlertI {
  title: string
  text: string
  icon?: sweetAlertIcon | 'loading'
  timer?: number
  timerProgressBar?: boolean
}

export function useSweetAlert(options: sweetAlertI) {
  const {
    title,
    text,
    icon,
    timer = 1500,
    timerProgressBar = true
  } = options;

  if (icon == 'loading') {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  } else {
    Swal.fire({
      title,
      text,
      icon: icon as sweetAlertIcon,
      timer,
      timerProgressBar,
    })
  }
}
