  'use strict';
  var Drawer = {
      canvas: null,

      drawCase1: function (canvas, hasFeature) {
        this.canvas = document.getElementById(canvas);
        var width = this.canvas.width;
        var height = this.canvas.height;
        var hasFeature = hasFeature;

        var count = 10;

        this.canvas.getContext('2d').clearRect(0, 0, width, height);

        //if hasFeature draw yellow lightning
        if (hasFeature) {
          var x = getRandomInt(0, width - 50);
          var y = getRandomInt(0, height - 50);
          this.drawLightning(x, y, 'yellow', '1');
          count--;
        }

        //draw red lightning bolts
        for (var i = 0; i < count; i++) {
          x = getRandomInt(0, width);
          y = getRandomInt(0, height);
          this.drawLightning(x, y, 'red', '1');
        }

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
      ,

      drawCase2: function (canvas, hasFeature) {
        this.canvas = document.getElementById(canvas);

        var width = this.canvas.width;
        var height = this.canvas.height;
        var hasFeature = hasFeature;

        var count = 20;

        this.canvas.getContext('2d').clearRect(0, 0, width, height);

        //if hasFeature
        if (hasFeature) {
          var x = getRandomInt(0, width - 100);
          var y = getRandomInt(0, height - 100);
          this.drawText('rAnDom', x, y, 'black');
          count--;
        }

        //draw red lightning bolts
        for (var i = 0; i < count; i++) {
          x = getRandomInt(10, width - 100);
          y = getRandomInt(50, height - 100);
          this.drawText('', x, y, 'black');
        }

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
      ,
      drawCase3: function (canvas, hasFeature) {
        this.canvas = document.getElementById(canvas);

        var width = this.canvas.width;
        var height = this.canvas.height;
        var hasFeature = hasFeature;

        var count = 20;

        this.canvas.getContext('2d').clearRect(0, 0, width, height);

        //if hasFeature
        if (hasFeature) {
          var x = getRandomInt(0, width - 100);
          var y = getRandomInt(0, height - 100);
          this.drawText('rAnDom', x, y, 'black');
          count--;
        }

        //draw red lightning bolts
        for (var i = 0; i < count; i++) {
          x = getRandomInt(10, width - 100);
          y = getRandomInt(70, height - 100);
          this.drawText('lorem', x, y, 'black');
        }

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
      ,

      drawCase4: function (canvas, hasFeature) {
        this.canvas = document.getElementById(canvas);

        var sizes = [0.5, 1, 1.5];
        var width = this.canvas.width;
        var height = this.canvas.height;
        var hasFeature = hasFeature;

        var count = 10;

        this.canvas.getContext('2d').clearRect(0, 0, width, height);

        //if hasFeature draw big yellow lightning
        if (hasFeature) {
          var x = getRandomInt(0, width - 100);
          var y = getRandomInt(0, height - 100);
          this.drawLightning(x, y, 'yellow', '1.5');
          count--;
        }

        //draw colored lightning bolts
        for (var i = 0; i < count; i++) {
          x = getRandomInt(0, width - 50);
          y = getRandomInt(0, height - 50);
          this.drawLightning(x, y, '#' + Math.floor(Math.random() * 16777215).toString(16), sizes[getRandomInt(0, 2)]);
        }

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
        }
      }
      ,

      //draws lightning bolt on given position
      drawLightning: function (x, y, color, scale) {
        var
          x = x + 10,
          y = y,
          color = color,
          scale = scale;

        if (this.canvas.getContext) {
          var ctx = this.canvas.getContext('2d');
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 50 * scale, y);
          ctx.lineTo(x + 30 * scale, y + 50 * scale);
          ctx.lineTo(x + 60 * scale, y + 50 * scale);
          ctx.lineTo(x - 10 * scale, y + 120 * scale);
          ctx.lineTo(x + 10 * scale, y + 70 * scale);
          ctx.lineTo(x - 10 * scale, y + 70 * scale);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        }
      },
      //draws text on given position
      drawText: function (text, x, y, color) {
        var
          x = x,
          y = y,
          color = color,
          rString = text;
        if (text === '') {
          rString = randomString(5, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        }

        if (this.canvas.getContext) {
          var ctx = this.canvas.getContext('2d');

          ctx.font = '48px serif';
          ctx.fillText(rString, x, y);
        }

        function randomString(length, chars) {
          var result = '';
          for (var i = length; i > 0; --i) {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
          return result;
        }
      }
    }
    ;
