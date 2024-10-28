type DropzoneStateType = {
    dropEffect: "copy"|"link"|"move"|"none",
    dragover_class: string,
    onDrop?: (dragEvent: DragEvent, data: string) => {}
}

// ToDo: discover appropriate node type with "draggable" and "cursor" attributes
export function draggable(node: HTMLElement, data: string) {
    let state = data;
    
    node.draggable = true;
    // node.cursor = "grab";
    
    function handle_dragstart(e: DragEvent) {
        e.dataTransfer?.setData("text/plain", state);
    }
    
    node.addEventListener("dragstart", handle_dragstart);
    
    return {
        update(data: string) {
            state = data;
        },
        destroy() {
            node.removeEventListener("dragstart", handle_dragstart);
        }
    }
}

export function dropzone(node: HTMLElement, options: any) {
    $effect(() => {// setup
        let state: DropzoneStateType = {
            dropEffect: "move",
            dragover_class: "droppable",
            ...options
        }

        function handle_dragenter(e: DragEvent) {
            (e.target as Element)?.classList.add(state.dragover_class);
        }

        function handle_dragleave(e: DragEvent) {
            (e.target as Element)?.classList.remove(state.dragover_class);
        }

        function handle_dragover(e: DragEvent) {
            e.preventDefault()
            if (e.dataTransfer != null) {
                e.dataTransfer.dropEffect = state.dropEffect;
            }
        }

        function handle_drop(e: DragEvent) {
            e.preventDefault();
            const data = e.dataTransfer?.getData("text/plain");
            (e.target as Element)?.classList.remove(state.dragover_class);
            if (state.onDrop) {
                state.onDrop(e, data ?? "");
            }
        }

        node.addEventListener("dragenter", handle_dragenter);
        node.addEventListener("dragleave", handle_dragleave);
        node.addEventListener("dragover", handle_dragover);
        node.addEventListener("drop", handle_drop);
        
        return () => {// teardown
            function update(options: EventListenerOptions) {
                state = {
                    dropEffect: "move",
                    dragover_class: "droppable",
                    ...options
                }
            }
            
            function destroy() {
                node.removeEventListener("dragenter", handle_dragenter);
                node.removeEventListener("dragleave", handle_dragleave);
                node.removeEventListener("dragover", handle_dragover);
                node.removeEventListener("drop", handle_drop);
            }
        }
    });
}