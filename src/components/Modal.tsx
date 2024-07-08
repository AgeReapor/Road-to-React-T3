import "./Modal.css";

type Props = {
  message: string;
};

export default function Modal({ message }: Props) {
  return (
    <div className="modal">
      <div className="modal-contents">
        <p>{message}</p>
        <button data-id="modal-btn">Play again</button>
      </div>
    </div>
  );
}
