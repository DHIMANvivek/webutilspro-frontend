'use client';

import React from 'react';

interface RepoGraphProps {
    commits: any[];
    rowHeight: number;
    width?: number;
}

const COLORS = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
];

/**
 * RepoGraph
 * Renders SVG lines for a git commit history graph
 */
export default function RepoGraph({ commits, rowHeight, width = 80 }: RepoGraphProps) {
    if (!commits || commits.length === 0) return null;

    // Track tracks (columns) for branches
    const tracks: string[] = [];
    const getTrack = (sha: string) => tracks.indexOf(sha);

    const nodes: any[] = [];
    const edges: any[] = [];

    // Simple layout algorithm
    commits.forEach((commit, index) => {
        const sha = commit.sha;
        const parents = commit.parents || [];

        // Find or assign track for this commit
        let trackIndex = getTrack(sha);
        if (trackIndex === -1) {
            // Find first empty track
            trackIndex = tracks.findIndex(t => t === '');
            if (trackIndex === -1) {
                trackIndex = tracks.length;
                tracks.push(sha);
            } else {
                tracks[trackIndex] = sha;
            }
        }

        const x = (trackIndex + 1) * 15;
        const y = (index + 0.5) * rowHeight;

        nodes.push({ sha, x, y, color: COLORS[trackIndex % COLORS.length] });

        // Update tracks for parents
        // Clear current commit's track if it's not being reused by a parent in this loop
        // But for a simple linear/graph view, we can just map parents to tracks
        parents.forEach((parent: any, pIndex: number) => {
            let parentTrackIndex = getTrack(parent.sha);
            if (parentTrackIndex === -1) {
                // Assign parent to a track
                if (pIndex === 0) {
                    // Main parent usually stays on same track
                    tracks[trackIndex] = parent.sha;
                    parentTrackIndex = trackIndex;
                } else {
                    // Branching parent
                    parentTrackIndex = tracks.findIndex(t => t === '');
                    if (parentTrackIndex === -1) {
                        parentTrackIndex = tracks.length;
                        tracks.push(parent.sha);
                    } else {
                        tracks[parentTrackIndex] = parent.sha;
                    }
                }
            }

            // Edge from parent to this commit (parent is below in history, but we process top-down)
            // Actually, we process commits from newest to oldest.
            // So this commit is at 'index', parent will be at some 'futureIndex'
            const parentIndex = commits.findIndex(c => c.sha === parent.sha);
            if (parentIndex !== -1) {
                edges.push({
                    from: { x, y },
                    to: { x: (parentTrackIndex + 1) * 15, y: (parentIndex + 0.5) * rowHeight },
                    color: COLORS[trackIndex % COLORS.length]
                });
            } else {
                // Parent not in current list, draw line off bottom
                edges.push({
                    from: { x, y },
                    to: { x, y: (commits.length + 1) * rowHeight },
                    color: COLORS[trackIndex % COLORS.length]
                });
            }
        });

        // If this commit has no parents in the list (and wasn't just updated), clear track
        if (parents.length === 0) {
            tracks[trackIndex] = '';
        }
    });

    return (
        <svg width={width} height={commits.length * rowHeight} className="overflow-visible">
            {/* Draw Edges */}
            {edges.map((edge, i) => (
                <path
                    key={`edge-${i}`}
                    d={`M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${edge.from.y + rowHeight / 2}, ${edge.to.x} ${edge.to.y - rowHeight / 2}, ${edge.to.x} ${edge.to.y}`}
                    stroke={edge.color}
                    strokeWidth="2"
                    fill="none"
                    strokeOpacity="0.6"
                />
            ))}

            {/* Draw Nodes */}
            {nodes.map((node) => (
                <circle
                    key={`node-${node.sha}`}
                    cx={node.x}
                    cy={node.y}
                    r="4"
                    fill={node.color}
                    stroke="white"
                    strokeWidth="2"
                />
            ))}
        </svg>
    );
}
