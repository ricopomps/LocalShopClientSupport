import { Button, Modal } from "react-bootstrap";

interface AlertModalProps {
  title: string;
  message: string;
  dismissText: string;
  acceptText: string;
  dismissButtonVariant?: string;
  acceptButtonVariant?: string;
  onDismiss: () => void;
  onAccepted: () => void;
}

const AlertModal = ({
  title,
  message,
  dismissText,
  acceptText,
  dismissButtonVariant,
  acceptButtonVariant,
  onDismiss,
  onAccepted,
}: AlertModalProps) => {
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onDismiss} variant={dismissButtonVariant}>
          {dismissText}
        </Button>
        <Button onClick={onAccepted} variant={acceptButtonVariant}>
          {acceptText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlertModal;
