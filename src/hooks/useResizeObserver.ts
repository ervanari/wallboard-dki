import { useState, useEffect, RefObject } from 'react';

/**
 * A custom hook that observes size changes of an element
 * @param ref React ref object to observe
 * @returns The current dimensions of the observed element
 */
export const useResizeObserver = (ref: RefObject<HTMLElement>) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const observeTarget = ref.current;
        if (!observeTarget) return;
        
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            });
        });
        
        resizeObserver.observe(observeTarget);
        return () => {
            resizeObserver.unobserve(observeTarget);
        };
    }, [ref]);
    
    return dimensions;
};
