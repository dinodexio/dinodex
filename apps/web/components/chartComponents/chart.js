import * as d3 from "d3";

class Stick {
  constructor(ctx, { x = 0, y = 0, width = 10, height, color = "black" }) {
    this.ctx = ctx;
    this.canvas = this.ctx.canvas;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = this.canvas.height - this.height - y;
    this.color = color;
    this.isDragging = false;
    this.isSelected = false;
  }

  setPosition(x) {
    this.x = x;
  }

  setIsSelected(value) {
    this.isSelected = value;
  }

  setIsDragging(value) {
    this.isDragging = value;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isInside(x, y) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    );
  }

  isCollideWith(otherObject) {
    return !(
      this.x > otherObject.x + otherObject.width ||
      this.x + this.width < otherObject.x ||
      this.y > otherObject.y + otherObject.height ||
      this.y + this.height < otherObject.y
    );
  }
}

class Rectangle {
  constructor(
    ctx,
    { x = 0, y = 0, radius = 0, width, height, color = "rgba(0, 0, 0, 0.2)" },
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  setWidth(value) {
    this.width = value;
  }

  setPosition(x) {
    this.x = x;
  }

  draw() {
    if (this.radius) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.x + this.radius, this.y);
      this.ctx.lineTo(this.x + this.width - this.radius, this.y);
      this.ctx.quadraticCurveTo(
        this.x + this.width,
        this.y,
        this.x + this.width,
        this.y + this.radius,
      );
      this.ctx.lineTo(this.x + this.width, this.y + this.height - this.radius);
      this.ctx.quadraticCurveTo(
        this.x + this.width,
        this.y + this.height,
        this.x + this.width - this.radius,
        this.y + this.height,
      );
      this.ctx.lineTo(this.x + this.radius, this.y + this.height);
      this.ctx.quadraticCurveTo(
        this.x,
        this.y + this.height,
        this.x,
        this.y + this.height - this.radius,
      );
      this.ctx.lineTo(this.x, this.y + this.radius);
      this.ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
      this.ctx.closePath();
      this.ctx.fillStyle = this.color;
      this.ctx.fill(); // Tô màu cho hình chữ nhật bo góc
    } else {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
}

class Drag {
  constructor(ctx, { sticks = [], width = 10, height }) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.stickFrom = new Stick(ctx, {
      ...sticks[0],
      height: height || this.canvas.height,
    });
    this.stickTo = new Stick(ctx, {
      ...sticks[1],
      height: height || this.canvas.height,
    });
    this.width = width;
    this.height = height;
    this.tarpaulin = new Rectangle(ctx, {
      x: this.stickFrom.x + this.stickFrom.width,
      width: this.getSpaceSticks(),
      height: height || this.canvas.height,
    });
  }

  getValues() {
    return {
      from: this.stickFrom.x + this.stickFrom.width,
      to: this.stickTo.x,
      space: this.getSpaceSticks(),
    };
  }

  isStickHover(mouseX, mouseY) {
    return [this.stickFrom, this.stickTo].some((stick) =>
      stick.isInside(mouseX, mouseY),
    );
  }

  isCollideSticks() {
    return this.stickFrom.isCollideWith(this.stickTo);
  }

  isMouseOverStickFrom(mouseX) {
    return this.stickTo.x > mouseX + this.stickFrom.width / 2;
  }

  isMouseOverStickTo(mouseX) {
    return (
      this.stickFrom.x + this.stickFrom.width < mouseX - this.stickTo.width / 2
    );
  }

  isDraggingStick() {
    return this.stickFrom.isDragging || this.stickTo.isDragging;
  }

  getPositionTaupaulin() {
    return this.stickFrom.x + this.stickFrom.width;
  }

  getStickDragging() {
    return [this.stickFrom, this.stickTo].find((stick) => stick.isDragging);
  }

  getSpaceSticks() {
    return this.stickTo.x - (this.stickFrom.x + this.stickFrom.width);
  }

  draw() {
    this.tarpaulin.draw();
    this.stickFrom.draw();
    this.stickTo.draw();
  }

  onMouseDown(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (this.stickFrom.isInside(mouseX, mouseY)) {
      this.stickFrom.setIsDragging(true);
      this.stickFrom.setIsSelected(true);
    }

    if (this.stickTo.isInside(mouseX, mouseY)) {
      this.stickTo.setIsDragging(true);
      this.stickTo.setIsSelected(true);
    }
  }

  onMouseMove(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    if (this.isDraggingStick() || this.isStickHover(mouseX, mouseY)) {
      this.canvas.style.cursor = "ew-resize";
    } else {
      this.canvas.style.cursor = "default";
    }

    if (this.stickFrom.isDragging && this.isMouseOverStickFrom(mouseX)) {
      this.stickFrom.setPosition(mouseX - this.stickFrom.width / 2);
      this.tarpaulin.setWidth(this.getSpaceSticks());
      this.tarpaulin.setPosition(this.getPositionTaupaulin());
    }

    if (this.stickTo.isDragging && this.isMouseOverStickTo(mouseX)) {
      this.stickTo.setPosition(mouseX - this.stickTo.width / 2);
      this.tarpaulin.setWidth(this.getSpaceSticks());
    }
  }

  onMouseUp(e) {
    this.stickFrom.isDragging = false;
    this.stickTo.isDragging = false;
  }

  onMouseOut(e) {
    // this.stickFrom.isDragging = false
    // this.stickTo.isDragging = false
  }
}

class TextDraw {
  constructor(ctx, { x = 0, y = 0, size = 30, value = "", color }) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.x = x;
    this.y = y;
    this.size = size;
    this.value = value;
    this.color = color || "blue";
  }

  draw() {
    this.ctx.font = `400 ${this.size}px SF Pro Display`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(this.value, this.x, this.y);
  }
}

class AxisX {
  constructor(ctx, { x = 0, y = 0, width, height, labels = [], color, size }) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.labels = labels.filter((i, index) => index % 3 === 0);
    this.size = size;
    this.color = color;
  }

  draw() {
    this.labels.forEach((label) => {
      new TextDraw(this.ctx, {
        x: label.position,
        y: this.y,
        value: label.label,
        size: this.size,
        color: this.color,
      }).draw();
    });
  }
}

class AxisY {
  constructor(
    ctx,
    { x = 0, y = 0, width, height, tick = 5, scaleD3, color, size },
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.tick = tick;
    this.scaleD3 = scaleD3;
    this.size = size;
    this.color = color;
  }

  draw() {
    const yTicks = this.scaleD3.ticks(this.tick);
    yTicks.forEach((tick) => {
      const y = this.scaleD3(tick);
      // this.ctx.beginPath();
      // this.ctx.moveTo(this.x - 30 + 5, this.y - y);
      // this.ctx.lineTo(this.x - 30, this.y - y);
      // this.ctx.stroke();
      new TextDraw(this.ctx, {
        x: this.x - 10,
        y: this.y - y,
        value: `$${tick}`,
        size: this.size,
        color: this.color,
      }).draw();
    });
  }
}

class BarsChart {
  constructor(
    ctx,
    {
      data = [],
      axis = { color: "green", size: 20 },
      marginBottomChart = 20,
      marginRightChart = 40,
      marginTopChart = 20,
      color,
    },
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.marginBottomChart = marginBottomChart;
    this.marginRightChart = marginRightChart;
    this.marginTopChart = marginTopChart;
    this.data = data.reverse();
    this.color = color;
    this.axis = axis;
    const columns = this.initColumn();
    this.column = columns.map(
      (col) =>
        new Rectangle(ctx, {
          x: col.x,
          y: col.y,
          width: col.width,
          height: col.height,
          color: color || "#FF603B",
          radius: col.width / 4,
        }),
    );

    this.axisX = new AxisX(ctx, {
      x: this.marginBottomChart,
      y: this.canvas.height - 10,
      color: this.axis.color,
      size: this.axis.size,
      labels: columns.map((col) => ({
        position: col.x + col.width / 2,
        label: d3.timeFormat("%H:%m")(new Date(col.label)),
      })),
    });
    this.axisY = new AxisY(ctx, {
      x: this.canvas.width - this.marginRightChart + 30,
      y: this.canvas.height - this.marginBottomChart,
      color: this.axis.color,
      size: this.axis.size,
      scaleD3: this.positionY,
      tick: 7,
    });

    this.draw();
  }

  getValues() {
    return {
      message: "Barschart hehe!!!",
    };
  }

  initColumn() {
    const columnWidth = 30; // Width of each column
    const columnSpacing = 10; // Space between columns

    this.positionX = d3
      .scaleBand()
      .domain(this.data.map((d) => d.letter))
      .range([0, this.canvas.width - this.marginRightChart])
      .padding(0.1);

    this.positionY = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value)])
      .range([
        0,
        this.canvas.height - this.marginBottomChart - this.marginTopChart,
      ]);

    const columns = this.data.map((d) => ({
      label: d.letter,
      y: this.canvas.height - this.positionY(d.value) - this.marginBottomChart,
      width: this.data.length < 10 ? columnWidth : this.positionX.bandwidth(),
      height: this.positionY(d.value) - this.positionY(0),
    }));

    // Center columns if there are less than 10
    if (this.data.length < 10) {
      const totalWidth = columns.length * columnWidth; // Width of each column
      const totalPadding = (columns.length - 1) * columnSpacing; // Total padding between columns
      const startX = (this.canvas.width - totalWidth - totalPadding) / 2; // Calculate starting x position to center

      columns.forEach((col, index) => {
        col.x = startX + index * (columnWidth + columnSpacing); // Update x position with spacing
      });
    } else {
      columns.forEach((col, index) => {
        col.x = this.positionX(d.letter); // Use the original position for 10 or more columns
      });
    }

    return columns;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.column.forEach((col) => col.draw());
    this.axisX.draw();
    this.axisY.draw();
  }
}

class PoolChart {
  constructor(
    ctx,
    {
      data = [],
      from = { value: 50, color: "#9FE4C9" },
      to = { value: 200, color: "#C5B4E3" },
      currentPrice = 150,
    },
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.drag = new Drag(ctx, {
      sticks: [
        { ...from, x: from.value },
        { ...to, x: to.value },
      ],
    });
    this.stickCurrentPrice = new Rectangle(ctx, {
      x: currentPrice,
      color: "black",
      width: 2,
      height: this.canvas.height,
    });
    this.init();
  }

  // Initialize event listeners
  init() {
    this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.canvas.addEventListener("mouseout", this.onMouseOut.bind(this));
    this.draw();
  }

  getValues() {
    return this.drag.getValues();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drag.draw();
    this.stickCurrentPrice.draw();
  }

  onMouseDown(e) {
    this.drag.onMouseDown(e);
    this.draw();
  }

  onMouseMove(e) {
    this.drag.onMouseMove(e);
    this.draw();
  }

  onMouseUp(e) {
    this.drag.onMouseUp(e);
    this.draw();
  }

  onMouseOut(e) {
    this.drag.onMouseOut(e);
    this.draw();
  }
}

class DoubleBarChart {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.data = config.data;
    this.colors = config.colors || ["#E1D9F0", "#E4F5EE"];
    this.axis = config.axis;
    this.onHover = config.onHover || function () { };
    this.hoverColors = config.hoverColors || ["#C0B0E0", "#C0E0D0"];
    this.setupEventListeners();
    this.margin = config.margin || { top: 20, right: 20, bottom: 29, left: 10 };
    this.hoverX = 0;
    this.hoverY = 0;
    this.barWidth = 20;
    this.spaceBetweenBars = 10;

    this.xScale = d3
      .scaleBand()
      .domain(this.data.map((d) => d.date))
      .range([this.margin.left, this.canvas.width - this.margin.right])
      .padding(0.1);

    this.yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => Math.max(d.value1, d.value2))])
      .range([this.canvas.height - this.margin.bottom, this.margin.top]);

    this.draw();
  }

  drawXAxis() {
    const xTicks = this.xScale.domain().filter((_, i) => i % 3 === 0); // Show every 3rd label

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.axis.color;
    this.ctx.font = `400 ${this.axis.size}px SF Pro Display`;

    xTicks.forEach((date) => {
      const x = this.xScale(date) + this.xScale.bandwidth() / 2;
      const y = this.canvas.height - this.margin.bottom + 10;

      // Format the date as needed
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      this.ctx.fillText(formattedDate, x, y);
    });
  }

  draw() {
    const width = this.canvas.width - 10;
    const height = this.canvas.height;
    const chartHeight = height - this.margin.top - this.margin.bottom;

    this.ctx.clearRect(0, 0, width, height);

    const maxValue = Math.max(
      ...this.data.flatMap((item) => item.value1 + item.value2),
    );

    // Vẽ các cột
    this.data.forEach((item, index) => {
      const isHovered = index === this.hoveredBar;

      const x =
        this.margin.left + index * (this.barWidth + this.spaceBetweenBars);
      const y = height - this.margin.bottom;

      // Chỉ vẽ các cột nằm trong vùng nhìn thấy
      if (x + this.barWidth > 0 && x < width) {
        // Vẽ cột cho value1
        const height1 = (item.value1 / maxValue) * (chartHeight - 10);
        this.ctx.fillStyle = isHovered ? this.hoverColors[0] : this.colors[0];
        this.ctx.fillRect(x, y - height1 + 1, this.barWidth, height1);

        // border top
        this.ctx.fillStyle = "#6A16FF";
        this.ctx.fillRect(x, y - height1, this.barWidth, 1);

        // Vẽ cột cho value2
        const height2 = (item.value2 / maxValue) * chartHeight;
        this.ctx.fillStyle = isHovered ? this.hoverColors[1] : this.colors[1];
        this.ctx.fillRect(
          x,
          y - height1 - height2 + 1,
          this.barWidth,
          height2 - 1,
        );

        // border top
        this.ctx.fillStyle = "#0A6";
        this.ctx.fillRect(x, y - height1 - height2 + 1, this.barWidth, 1);

        if (isHovered) {
          this.drawHoverEffects(x, y - height1 - height2);
        }

        if (index % 3 === 0) {
          this.ctx.fillStyle = this.axis.color;
          this.ctx.font = `400 ${this.axis.size}px SF Pro Display`;
          this.ctx.textAlign = "center";
          const formattedDate = new Date(item.date).toLocaleDateString(
            "en-US",
            { month: "short", year: "numeric" },
          );
          this.ctx.fillText(formattedDate, x + this.barWidth / 2 + 10, y + 20);
        }
      }
    });
  }

  updateSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseout", this.handleMouseOut.bind(this));
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.canvas.style.cursor = "pointer";
    this.checkHover(x, y);
  }

  handleMouseOut() {
    if (this.hoveredBar !== null) {
      this.hoveredBar = null;
      this.draw();
      this.canvas.style.cursor = "default";
    }
  }

  checkHover(mouseX, mouseY) {
    const margin = { top: 20, right: 20, bottom: 30, left: 10 };
    const chartHeight = this.canvas.height - margin.top - margin.bottom;
    for (let i = 0; i < this.data.length; i++) {
      const barX = margin.left + i * (this.barWidth + this.spaceBetweenBars);
      const barY = this.canvas.height - margin.bottom;
      if (
        mouseX >= barX &&
        mouseX <= barX + this.barWidth &&
        mouseY >= barY - chartHeight &&
        mouseY <= barY
      ) {
        if (this.hoveredBar !== i) {
          this.hoveredBar = i;
          this.hoveredBarPosition = { x: barX, y: barY };
          this.draw();
        }
        this.onHover(barX, this.data[i]);
        return;
      }
    }

    if (this.hoveredBar !== null) {
      this.hoveredBar = null;
      this.hoveredBarPosition = null;
      this.draw();
    }
  }

  drawHoverEffects(x, y) {
    if (this.hoveredBar !== null) {
      this.ctx.beginPath();
      // Vertical line
      this.ctx.moveTo(x + 10, this.margin.top);
      this.ctx.lineTo(x + 10, y);
      this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }
  }
}

class DoubleAreaChart {
  constructor(
    ctx,
    {
      data = [],
      colors = ["#0A6", "#6A16FF"],
      colorPointHover = [
        {
          color: "#8E59ED",
          colorStroke: "#9767EE",
        },
        {
          color: "#57CD9E",
          colorStroke: "#7BD8B2",
        },
      ],
      colorArea = ["red", "blue"],
      axis = { color: "#000", size: 14 },
      marginBottom = 28,
      marginRight = 1,
      marginTop = 20,
      marginLeft = 1,
      onHover = (x, dataHover) => { },
    },
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.data = data;
    this.hoverLine = null;
    this.setupEventListeners();
    this.colorArea = colorArea;
    this.colorPointHover = colorPointHover;
    this.colors = colors;
    this.axis = axis;
    this.onHover = onHover;
    this.margin = {
      bottom: marginBottom,
      right: marginRight,
      top: marginTop,
      left: marginLeft,
    };

    this.initScales();
    this.draw();
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseout", this.handleMouseOut.bind(this));
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - this.margin.left;
    const date = this.xScale.invert(x);
    this.canvas.style.cursor = "pointer";

    this.hoverLine = x;

    const bisect = d3.bisector((d) => d.date).left;
    const index = bisect(this.data, date, 1);
    const d0 = this.data[index - 1];
    const d1 = this.data[index];
    const d = date - d0.date > d1.date - date ? d1 : d0;

    this.hoverData = d;

    this.onHover(x + this.margin.left, this.hoverData);
    this.draw();
  }

  handleMouseOut() {
    this.hoverLine = null;
    this.hoverData = null;
    this.canvas.style.cursor = "default";
    this.draw();
  }

  drawHoverEffects() {
    if (this.hoverLine !== null && this.hoverData !== null) {
      const x = this.xScale(this.hoverData.date) + this.margin.left;

      // Draw vertical line
      this.ctx.beginPath();
      // Vertical line
      this.ctx.moveTo(x, this.margin.top);
      this.ctx.lineTo(x, this.canvas.height - this.margin.bottom);
      // Horizontal line
      if (this.hoverData.value1 > this.hoverData.value2) {
        this.ctx.moveTo(
          this.margin.left,
          this.yScale(this.hoverData.value1) + this.margin.top,
        );
        this.ctx.lineTo(
          x + (this.canvas.width - x),
          this.yScale(this.hoverData.value1) + this.margin.top,
        );
      } else {
        this.ctx.moveTo(
          this.margin.left,
          this.yScale(this.hoverData.value2) + this.margin.top,
        );
        this.ctx.lineTo(
          x + (this.canvas.width - x),
          this.yScale(this.hoverData.value2) + this.margin.top,
        );
      }
      this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();

      // Draw points on lines
      this.drawPointOnLine(
        this.hoverData.date,
        this.hoverData.value1,
        this.colorPointHover[0].color,
        this.colorPointHover[0].colorStroke,
      );
      this.drawPointOnLine(
        this.hoverData.date,
        this.hoverData.value2,
        this.colorPointHover[1].color,
        this.colorPointHover[1].colorStroke,
      );
    }
  }

  drawPointOnLine(date, value, color, colorStroke) {
    const x = this.xScale(date) + this.margin.left;
    const y = this.yScale(value) + this.margin.top;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.strokeStyle = colorStroke;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  initScales() {
    const width = this.canvas.width - this.margin.left - this.margin.right;
    const height = this.canvas.height - this.margin.top - this.margin.bottom;

    this.xScale = d3
      .scaleTime()
      .domain(d3.extent(this.data, (d) => d.date))
      .range([0, width]);

    const yMin = d3.min(this.data, (d) => Math.min(d.value1, d.value2));
    const yMax = d3.max(this.data, (d) => Math.max(d.value1, d.value2));

    this.yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice(); // This will round the scale to nice round numbers
  }

  drawLine(values, color) {
    const line = d3
      .line()
      .x((d) => this.xScale(d.date))
      .y((d) => this.yScale(d.value))
      .context(this.ctx);

    this.ctx.save();
    this.ctx.translate(this.margin.left, this.margin.top);
    this.ctx.beginPath();
    line(values);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawArea(values, color) {
    const area = d3
      .area()
      .x((d) => this.xScale(d.date))
      .y0(this.yScale.range()[0])
      .y1((d) => this.yScale(d.value))
      .context(this.ctx);

    this.ctx.save();
    this.ctx.translate(this.margin.left, this.margin.top);
    this.ctx.beginPath();
    area(values);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    // this.ctx.globalAlpha = 0.2;
    this.ctx.restore();
  }

  drawAxes() {
    const height = this.canvas.height - this.margin.top - this.margin.bottom;

    // Draw X-axis labels
    const xTicks = this.xScale.ticks(d3.timeYear.every(1));
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.axis.color;
    this.ctx.font = `400 ${this.axis.size}px SF Pro Display`;

    xTicks.forEach((date) => {
      const x = this.xScale(date) + this.margin.left;
      const y = height + this.margin.top + 10;
      this.ctx.fillText(date.getFullYear(), x, y);
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawArea(
      this.data.map((d) => ({ date: d.date, value: d.value1 })),
      this.colorArea[0],
    );
    this.drawLine(
      this.data.map((d) => ({ date: d.date, value: d.value1 })),
      this.colors[0],
    );

    this.drawArea(
      this.data.map((d) => ({ date: d.date, value: d.value2 })),
      this.colorArea[1],
    );
    this.drawLine(
      this.data.map((d) => ({ date: d.date, value: d.value2 })),
      this.colors[1],
    );

    this.drawAxes();

    this.drawHoverEffects();
  }

  updateSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw();
  }

  getValues() {
    return {
      message: "Line Chart Data",
    };
  }
}

class SingleAreaChart {
  constructor(
    ctx,
    {
      data = [],
      color = "#0A6",
      colorPointHover = {
        color: "#57CD9E",
        colorStroke: "#7BD8B2",
      },
      colorArea = "rgba(10, 102, 0, 0.1)",
      axis = { color: "#000", size: 14 },
      marginBottom = 28,
      marginRight = 40,
      marginTop = 20,
      marginLeft = 0,
      onHover = (x, dataHover) => { },
    },
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.data = data.reverse();
    this.hoverLine = null;
    this.setupEventListeners();
    this.colorArea = colorArea;
    this.colorPointHover = colorPointHover;
    this.color = color;
    this.axis = axis;
    this.onHover = onHover;
    this.margin = {
      bottom: marginBottom,
      right: marginRight,
      top: marginTop,
      left: marginLeft,
    };

    this.initScales();
    this.draw();
    this.popup = document.createElement('div');
    this.popup.style.position = 'absolute';
    this.popup.style.backgroundColor = '#383d45';
    this.popup.style.color="white"
    this.popup.style.fontSize = 12
    this.popup.style.borderRadius="5px"
    this.popup.style.padding = '5px';
    this.popup.style.display = 'none';
    document.body.appendChild(this.popup);
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.canvas.addEventListener("mouseout", this.handleMouseOut.bind(this));
  }

  handleMouseMove(event) {
    if(!this.data || this.data.length === 0) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - this.margin.left;
    this.canvas.style.cursor = "pointer";

    this.hoverLine = x;

    const date = this.xScale.invert(x);
    const bisect = d3.bisector((d) => d.date).left;
    const numerical = bisect(this.data, date.valueOf());

    const d0 = this.data[numerical - 1];
    const d1 = this.data[numerical];

    if (!d0 || !d1) return;

    const d = date - d0.date > d1.date - date ? d1 : d0;

    this.hoverData = d;

    this.onHover(x + this.margin.left, this.hoverData);
    this.draw();
    this.popup.innerHTML = `${d3.timeFormat("%d/%m/%y %H:%M")(d.date)}`;
    this.popup.style.left = `${event.clientX + 10}px`;
    this.popup.style.position = 'absolute'
    this.popup.style.bottom = `${this.canvas.height - 90}px`; // Set to bottom of the chart
    this.popup.style.display = 'block';
    this.popup.style.zIndex = 100;
  }

  handleMouseOut() {
    this.hoverLine = null;
    this.hoverData = null;
    this.canvas.style.cursor = "default";
    this.draw();
    this.popup.style.display = 'none';
  }

  drawHoverEffects() {
    if (this.hoverLine !== null && this.hoverData !== null) {
      const x = this.xScale(this.hoverData.date) + this.margin.left;

      // Draw vertical line
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.margin.top);
      this.ctx.lineTo(x, this.canvas.height - this.margin.bottom);
      this.ctx.strokeStyle = "rgba(0,0,0,0.5)";
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();

      // Draw point on line
      this.drawPointOnLine(
        this.hoverData.date,
        this.hoverData.value,
        this.colorPointHover.color,
        this.colorPointHover.colorStroke,
      );
    }
  }

  drawPointOnLine(date, value, color, colorStroke) {
    const x = this.xScale(date) + this.margin.left;
    const y = this.yScale(value) + this.margin.top;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.strokeStyle = colorStroke;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  initScales() {
    const width = this.canvas.width - this.margin.left - this.margin.right;
    const height = this.canvas.height - this.margin.top - this.margin.bottom;

    this.xScale = d3
      .scaleTime()
      .domain(d3.extent(this.data, (d) => d.date))
      .range([0, width]);
    const yMin = d3.min(this.data, (d) => d.value);
    const yMax = d3.max(this.data, (d) => d.value);

    this.yScale = d3
      .scaleLinear()
      .domain([yMin, yMax])
      .range([height, 0])
      .nice();
  }

  drawLine() {
    const line = d3
      .line()
      .x((d) => this.xScale(d.date))
      .y((d) => this.yScale(d.value))
      .context(this.ctx);

    this.ctx.save();
    this.ctx.translate(this.margin.left, this.margin.top);
    this.ctx.beginPath();
    line(this.data);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawArea() {
    const area = d3
      .area()
      .x((d) => this.xScale(d.date))
      .y0(this.yScale.range()[0])
      .y1((d) => this.yScale(d.value))
      .context(this.ctx);

    this.ctx.save();
    this.ctx.translate(this.margin.left, this.margin.top);
    this.ctx.beginPath();
    area(this.data);
    this.ctx.fillStyle = this.colorArea;
    this.ctx.fill();
    this.ctx.restore();
  }

  drawAxes() {
    const height = this.canvas.height - this.margin.top - this.margin.bottom;

    const yTicks = this.yScale.ticks(5);
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";
    this.ctx.fillStyle = this.axis.color;
    this.ctx.font = `400 ${this.axis.size}px SF Pro Display`;

    yTicks.forEach((tick) => {
      const x = this.canvas.width;
      const y = this.yScale(tick) + this.margin.top;
      this.ctx.fillText(`$${tick.toFixed(3)}`, x, y);
    });

    // Draw X-axis labels
    const timeRange = this.xScale.domain();
    const startTime = timeRange[0];
    const endTime = timeRange[1];
    const xTicks = [];
    for (let i = 0; i < 6; i++) {
      const time = new Date(
        startTime.getTime() +
        (endTime.getTime() - startTime.getTime()) * (i / 6),
      );
      xTicks.push(time);
    }

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    this.ctx.fillStyle = this.axis.color;
    this.ctx.font = `400 ${this.axis.size}px SF Pro Display`;

    xTicks.forEach((date) => {
      const x = this.xScale(date) + 40;
      const y = height + this.margin.top + 10;
      this.ctx.fillText(
        date.toLocaleTimeString("us-UA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        x,
        y,
      );
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawArea();
    this.drawLine();
    this.drawAxes();
    this.drawHoverEffects();
  }

  updateSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.initScales();
    this.draw();
  }

  getValues() {
    return {
      message: "Single Line Chart Data",
    };
  }
}

class LineChart {
  constructor(
    ctx,
    {
      data,
      color = "#0A6",
      axis,
      marginBottom,
      marginLeft,
      marginTop,
      marginRight,
    },
  ) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.data = data.map((d) => ({
      date: d.date instanceof Date ? d.date : new Date(d.date),
      value: d.value,
    }));
    this.color = color;
    this.axis = axis;
    this.margin = {
      bottom: marginBottom || 30,
      left: marginLeft || 40,
      top: marginTop || 20,
      right: marginRight || 20,
    };

    this.initScales();
    this.draw();
  }

  initScales() {
    const width = this.canvas.width - this.margin.left - this.margin.right;
    const height = this.canvas.height - this.margin.top - this.margin.bottom;

    this.xScale = d3
      .scaleTime()
      .domain(d3.extent(this.data, (d) => d.date))
      .range([0, width]);

    // this.xScale = d3
    // .scalePoint()
    // .domain(this.data.map((d) => d.date))
    // .range([0, width])
    // .padding(0.3);

    this.yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value)])
      .range([height, 0]);
  }

  drawAxes() {
    // const width = this.canvas.width;
    // const height = this.canvas.height - this.margin.top - this.margin.bottom;
    // this.ctx.fillStyle = this.axis.color;
    // this.ctx.font = `400 ${this.axis.size}px Arial`;
    // this.ctx.textAlign = "center";
    // this.ctx.textBaseline = "top";
    // const xTicks = this.xScale.ticks(5);
    // xTicks.forEach((tick) => {
    //   const x = this.xScale(tick) + this.margin.left;
    //   const y = height + this.margin.top + 10;
    //   const formattedTick = d3.timeFormat("%b %d")(tick);
    //   this.ctx.fillText(formattedTick, x, y);
    // });
    // const yTicks = this.yScale.ticks(5);
    // this.ctx.textAlign = "right";
    // this.ctx.textBaseline = "middle";
    // yTicks.forEach((tick) => {
    //   const x = this.margin.left - 10;
    //   const y = this.yScale(tick) + this.margin.top;
    //   this.ctx.fillText(tick, x, y);
    // });
  }

  drawLine() {
    const line = d3
      .line()
      .x((d) => this.xScale(d.date))
      .y((d) => this.yScale(d.value))
      .context(this.ctx);

    this.ctx.save();
    this.ctx.translate(this.margin.left, this.margin.top);
    this.ctx.beginPath();
    line(this.data);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.restore();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // this.drawAxes();
    this.drawLine();
  }
}

export {
  Stick,
  Rectangle,
  Drag,
  DoubleBarChart,
  BarsChart,
  PoolChart,
  LineChart,
  DoubleAreaChart,
  SingleAreaChart,
};
