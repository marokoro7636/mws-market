import { Button } from '@mui/material';
import React from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

import Cytoscape from 'cytoscape';

const klay = require('cytoscape-klay')
Cytoscape.use(klay);

interface Team {
    id: string,
    name: string,
    year: string,
}

interface RelationGraphProps {
    teams: Team[]
}

function RelationGraph(teams: RelationGraphProps) {
    // let elements = [
    //     { data: { id: 'one', label: 'Node 1' } },
    //     { data: { id: 'two', label: 'Node 2' } },

    //     { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } }
    // ];
    let yearDict: any = {}
    for (let team of teams.teams) {
        if (!yearDict[team.year]) {
            yearDict[team.year] = []
        }
        yearDict[team.year].push(team)
    }
    const yearList = Object.keys(yearDict).sort()

    let elements: any[] = []
    for (let team of teams.teams) {
        elements.push({ data: { id: team.id, label: team.name } })
    }
    for (let i = 0; i < yearList.length - 1; i++) {
        const cur = yearDict[yearList[i]]
        const prev = yearDict[yearList[i + 1]]
        for (const c of cur) {
            for (const p of prev) {
                elements.push({ data: { source: c.id, target: p.id } })
            }
        }
    }

    console.log(elements)
    let cyRef: any = null

    return (
        <div style={{ width: "100%", minHeight: "500px", padding: "3%" }}>
            <Button
                onClick={() => {
                    if (!cyRef) {
                        return
                    }
                    cyRef.layout({ name: "klay" }).run()
                }}
            >Reset</Button>
            <CytoscapeComponent
                cy={(cy) => {
                    cyRef = cy
                    cy.layout({ name: "klay" }).run()
                }}
                layout={{ name: "klay" }}
                elements={elements}
                style={{ background: "#eee", minHeight: "500px", width: "94%" }} />
        </div>
    );
}

export default RelationGraph;