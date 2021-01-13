import React from 'react';
import ReactDOM from 'react-dom';
import FocusTrap from 'focus-trap-react';
import CreatePlaylist from './CreatePlaylist';
import '../style/playlist.css';

export default function NewPlaylist({
    onClickOutside,
    modalRef,
    buttonRef,
    closeModal,
    uri,
    addSongToPlaylist
}) {
    return ReactDOM.createPortal(
        <FocusTrap>
            <aside
                tag="aside"
                role="dialog"
                tabIndex="-1"
                aria-modal="true"
                className="modal-cover"
                onClick={onClickOutside}
            >
                <div className="modal-area" ref={modalRef}>
                    <button
                        type="button"
                        ref={buttonRef}
                        aria-label="Close Modal"
                        aria-labelledby="close-modal"
                        className="_modal-close"
                        onClick={closeModal}
                    >
                        <span id="close-modal" className="_hide-visual">
                            Close
                        </span>
                        <svg className="_modal-close-icon" viewBox="0 0 40 40">
                            <path d="M 10,10 L 30,30 M 30,10 L 10,30" />
                        </svg>
                    </button>
                    <div className="modal-body">
                        <CreatePlaylist uri={uri} closeModal={closeModal} addSongToPlaylist={addSongToPlaylist} />
                    </div>
                </div>
            </aside>
        </FocusTrap>,
        document.body
    );
}
