import { useDispatch } from "react-redux";
import { redoAction, undoAction } from "../actions/sheetActions";
import { useEffect } from "react";

const useUndoRedo = () => {
    const dispatch = useDispatch();

    const handleUndo = () => dispatch(undoAction());
    const handleRedo = () => dispatch(redoAction());

    const handleUndoKeyPress = (event: KeyboardEvent) => {
        if(event.key === 'z' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            handleUndo();
        }
    }

    const handleRedoKeyPress = (event: KeyboardEvent) => {
        if(event.key === 'y' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            handleRedo();
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleUndoKeyPress);
        window.addEventListener('keydown', handleRedoKeyPress);

        return () => {
            window.removeEventListener('keydown', handleUndoKeyPress);
            window.removeEventListener('keydown', handleRedoKeyPress);
        }
    }, []);
}

export { useUndoRedo }; 