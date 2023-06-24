import { Button, Modal } from 'react-bootstrap'

export default function ConfirmationModal ({ title, message, confirmationMessage = 'Confirm', onConfirm, onCancel }) {
  return (
    <Modal show onHide={onCancel} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
        <Button variant='danger' onClick={onConfirm}>
          {confirmationMessage}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
