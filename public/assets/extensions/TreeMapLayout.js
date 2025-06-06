/*
 *  Copyright 1998-2025 by Northwoods Software Corporation. All Rights Reserved.
 */
/*
 * This is an extension and not part of the main GoJS library.
 * The source code for this is at extensionsJSM/TreeMapLayout.ts.
 * Note that the API for this class may change with any version, even point releases.
 * If you intend to use an extension in production, you should copy the code to your own source directory.
 * Extensions can be found in the GoJS kit under the extensions or extensionsJSM folders.
 * See the Extensions intro page (https://gojs.net/latest/intro/extensions.html) for more information.
 */

/**
 * A custom {@link go.Layout} that lays out hierarchical data using nested rectangles.
 *
 * If you want to experiment with this extension, try the <a href="../../samples/TreeMap.html">TreeMap Layout</a> sample.
 * @category Layout Extension
 */
class TreeMapLayout extends go.Layout {
    constructor(init) {
        super();
        this._isTopLevelHorizontal = false;
        if (init)
            Object.assign(this, init);
    }
    /**
     * Gets or sets whether top level Parts are laid out horizontally.
     */
    get isTopLevelHorizontal() {
        return this._isTopLevelHorizontal;
    }
    set isTopLevelHorizontal(val) {
        val = !!val;
        if (this._isTopLevelHorizontal !== val) {
            this._isTopLevelHorizontal = val;
            this.invalidateLayout();
        }
    }
    /**
     * Copies properties to a cloned Layout.
     */
    cloneProtected(copy) {
        super.cloneProtected(copy);
        copy._isTopLevelHorizontal = this._isTopLevelHorizontal;
    }
    /**
     * This method actually positions all of the nodes by determining total area and then recursively tiling nodes from the top-level down.
     * @param coll - A {@link go.Diagram} or a {@link go.Group} or a collection of {@link go.Part}s.
     */
    doLayout(coll) {
        if (!(coll instanceof go.Diagram))
            throw new Error('TreeMapLayout only works as the Diagram.layout');
        const diagram = coll;
        this.computeTotals(diagram); // make sure data.total has been computed for every node
        // figure out how large an area to cover;
        // perhaps this should be a property that could be set, rather than depending on the current viewport
        this.arrangementOrigin = this.initialOrigin(this.arrangementOrigin);
        const x = this.arrangementOrigin.x;
        const y = this.arrangementOrigin.y;
        let w = diagram.viewportBounds.width;
        let h = diagram.viewportBounds.height;
        if (isNaN(w))
            w = 1000;
        if (isNaN(h))
            h = 1000;
        // collect all top-level nodes, and sum their totals
        const tops = new go.Set();
        let total = 0;
        diagram.nodes.each((n) => {
            if (n.isTopLevel) {
                tops.add(n);
                total += n.data.total;
            }
        });
        const horiz = this.isTopLevelHorizontal; // initially horizontal layout?
        // the following was copied from the layoutNode method
        let gx = x;
        let gy = y;
        const lay = this;
        tops.each((part) => {
            const tot = part.data.total;
            if (horiz) {
                const pw = (w * tot) / total;
                lay.layoutNode(!horiz, part, gx, gy, pw, h);
                gx += pw;
            }
            else {
                const ph = (h * tot) / total;
                lay.layoutNode(!horiz, part, gx, gy, w, ph);
                gy += ph;
            }
        });
    }
    /**
     * @hidden @internal
     */
    layoutNode(horiz, part, x, y, w, h) {
        part.moveTo(x, y);
        part.desiredSize = new go.Size(w, h);
        if (part instanceof go.Group) {
            const g = part;
            const total = g.data.total;
            let gx = x;
            let gy = y;
            const lay = this;
            g.memberParts.each((p) => {
                if (p instanceof go.Link)
                    return;
                const tot = p.data.total;
                if (horiz) {
                    const pw = (w * tot) / total;
                    lay.layoutNode(!horiz, p, gx, gy, pw, h);
                    gx += pw;
                }
                else {
                    const ph = (h * tot) / total;
                    lay.layoutNode(!horiz, p, gx, gy, w, ph);
                    gy += ph;
                }
            });
        }
    }
    /**
     * Compute the `data.total` for each node in the Diagram, with a {@link go.Group}'s being a sum of its members.
     */
    computeTotals(diagram) {
        if (!diagram.nodes.all((g) => !(g instanceof go.Group) || g.data.total >= 0)) {
            let groups = new go.Set();
            diagram.nodes.each((n) => {
                if (n instanceof go.Group) {
                    // collect all groups
                    groups.add(n);
                }
                else {
                    // regular nodes just have their total == size
                    n.data.total = n.data.size;
                }
            });
            // keep looking for groups whose total can be computed, until all groups have been processed
            while (groups.count > 0) {
                const grps = new go.Set();
                groups.each((g) => {
                    // for a group all of whose member nodes have an initialized data.total,
                    if (g.memberParts.all((m) => !(m instanceof go.Group) || m.data.total >= 0)) {
                        // compute the group's total as the sum of the sizes of all of the member nodes
                        g.data.total = 0;
                        g.memberParts.each((m) => {
                            if (m instanceof go.Node)
                                g.data.total += m.data.total;
                        });
                    }
                    else {
                        // remember for the next iteration
                        grps.add(g);
                    }
                });
                groups = grps;
            }
        }
    }
}
