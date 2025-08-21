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
  if (options.icon == 'loading') {
    Swal.fire({
      title: options.title,
      text: options.text,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })
  } else {
    Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon as sweetAlertIcon,
      timer: options.timer,
      timerProgressBar: options.timerProgressBar,
    })
  }
}
