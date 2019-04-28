window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Touch: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0b314+bKq1KoaWaRO/ASGaa", "Touch");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _isTouch: false
      },
      onLoad: function onLoad() {
        this.node.once(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.once(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.once(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancle, this);
      },
      onTouchStart: function onTouchStart(event) {
        this._isTouch = true;
      },
      onTouchCancle: function onTouchCancle() {
        this._isTouch = false;
      },
      onTouchEnd: function onTouchEnd(event) {
        if (!this._isTouch) return;
        var pos = this.node.position;
        var parent = this.node.parent;
        var url = "prefabs/explosion";
        cc.loader.loadRes(url, function(err, prefab) {
          if (err) {
            cc.log("explosion err");
            return;
          }
          var explosion = cc.instantiate(prefab);
          explosion.position = pos;
          explosion.parent = parent;
        });
        this._isTouch = false;
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {} ],
  ball: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "430e9KsXN9CvbEu0Jio6Ylw", "ball");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _isEnterDoor: false
      },
      onLoad: function onLoad() {},
      onCollisionEnter: function onCollisionEnter(other, self) {
        var ball = self.node.getComponent("ball");
        if (ball._isEnterDoor) return;
        if ("star" == other.node.group) other.node.getComponent("star").Destroy(); else if ("door" == other.node.group) {
          cc.systemEvent.emit("gameWin");
          ball._isEnterDoor = true;
        } else if ("wall" == other.node.group) {
          var ball = self.node.parent.getComponent(cc.RigidBody);
          ball.linearVelocity = cc.v2(0, 0);
          ball.angularVelocity = 0;
          window.poolManager.put(self.node.parent);
        }
      },
      onCollisionExit: function onCollisionExit(other, self) {},
      enterDoor: function enterDoor() {
        cc.log("enterDoor");
        this.node.runAction(cc.fadeTo(.1, 100), cc.callFunc(function() {
          this.node.removeComponent(cc.PhysicsCircleCollider);
          this.node.removeComponent(cc.CircleCollider);
        }));
      },
      onDestroy: function onDestroy() {}
    });
    cc._RF.pop();
  }, {} ],
  boomEffect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc249KCyuxKAaMex/ST8IFd", "boomEffect");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        boomValue: 200
      },
      onLoad: function onLoad() {
        var ani = this.node.getComponent(cc.Animation);
        ani.play("boomEffect");
        ani.on("finished", this.onFinishedCallback, this);
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        if ("ball" == other.node.group) {
          var boom = self.node.getComponent("boomEffect");
          var vec = boom.getForceVec(other.node.parent, self.node);
          var ball = other.node.parent.getComponent(cc.RigidBody);
          ball.linearVelocity = cc.v2(vec.x + ball.linearVelocity.x, vec.y + ball.linearVelocity.y);
        }
      },
      getForceVec: function getForceVec(other, self) {
        var vec = other.position.sub(self.position);
        vec = vec.normalize().mul(this.boomValue);
        return vec;
      },
      onFinishedCallback: function onFinishedCallback() {
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {} ],
  boom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c9c03gyR1NDXLGu4q83p6EJ", "boom");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        boomValue: 200
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
      },
      onTouchStart: function onTouchStart() {
        var _this = this;
        var pos = this.node.position;
        var parent = this.node.parent;
        var url = "prefabs/boomEffect";
        cc.loader.loadRes(url, function(err, prefab) {
          if (err) {
            cc.log("boomEffect err");
            return;
          }
          var boomEffect = cc.instantiate(prefab);
          boomEffect.getComponent("boomEffect").boomValue = _this.boomValue;
          boomEffect.position = pos;
          boomEffect.parent = parent;
        });
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {} ],
  dataManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "997793HRBRGuq1MWiLzmX0P", "dataManager");
    "use strict";
    window.PAGE_COUNT = 1;
    window.STAGE_COUNT = 14;
    window.PAGE_STAGE_PER_COUNT = STAGE_COUNT / PAGE_COUNT;
    window.STAGE_LINE_COUNT = 2;
    var dataManager = cc.Class({
      name: "dataManager",
      properties: {
        curLevel: 1,
        starNum: 0,
        stageInfo: null
      },
      ctor: function ctor() {},
      getStageInfo: function getStageInfo() {
        if (null == this.stageInfo) {
          var stageInfo = cc.sys.localStorage.getItem("stageInfo");
          cc.log("--------stageInfo---------");
          cc.log(stageInfo);
          this.stageInfo = null == stageInfo || stageInfo == {} || "" == stageInfo ? {
            1: 0
          } : JSON.parse(stageInfo);
        }
        return this.stageInfo;
      },
      saveStageInfo: function saveStageInfo() {
        cc.sys.localStorage.setItem("stageInfo", JSON.stringify(this.stageInfo));
      },
      updateStageInfo: function updateStageInfo(level, star) {
        if (null == this.stageInfo[level] || null != this.stageInfo[level] && this.stageInfo[level] < star) {
          this.stageInfo[level] = star;
          level + 1 < window.STAGE_COUNT && (this.stageInfo[level + 1] || (this.stageInfo[level + 1] = 0));
          this.saveStageInfo();
        }
      }
    });
    window.dataManager = new dataManager();
    cc._RF.pop();
  }, {} ],
  gameUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4cd491QYzhNt7RZC4cjdh6j", "gameUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        level: cc.Label,
        starList: [ cc.Sprite ],
        starSF: cc.SpriteFrame,
        starEffect: cc.Prefab,
        winNode: cc.Node,
        winStarNum: cc.Sprite,
        winStarSF: [ cc.SpriteFrame ],
        levleNode: cc.Node,
        _starCount: 0
      },
      onLoad: function onLoad() {
        this.winNode.active = false;
        this.setLevel();
      },
      onEnable: function onEnable() {
        cc.systemEvent.on("updateStar", this.updateStar, this);
        cc.systemEvent.on("gameWin", this.gameWin, this);
      },
      onDestroy: function onDestroy() {
        cc.systemEvent.off("updateStar", this.updateStar, this);
        cc.systemEvent.off("gameWin", this.gameWin, this);
      },
      setLevel: function setLevel() {
        this.level.string = "Level\uff1a" + window.dataManager.curLevel;
      },
      updateStar: function updateStar() {
        cc.log("updateStar");
        this._starCount++;
        for (var i = this._starCount - 1; i < this._starCount; i++) {
          this.starList[i].spriteFrame = this.starSF;
          var effect = cc.instantiate(this.starEffect);
          var ani = effect.getComponent(cc.Animation);
          ani.on("finished", function() {
            effect.destroy();
          });
          effect.position = this.starList[i].node.position;
          effect.parent = this.starList[i].node.parent;
        }
      },
      gameWin: function gameWin() {
        cc.log("\u606d\u559c\u8fc7\u5173");
        window.dataManager.updateStageInfo(window.dataManager.curLevel, this._starCount);
        this.winNode.active = true;
        this.winStarNum.spriteFrame = this.winStarSF[this._starCount];
      },
      reAgainBtnClicked: function reAgainBtnClicked() {
        cc.director.loadScene("game");
      },
      nextGameBtnClicked: function nextGameBtnClicked() {
        if (window.dataManager.curLevel < window.STAGE_COUNT) {
          window.dataManager.curLevel += 1;
          cc.director.loadScene("game");
        } else cc.director.loadScene("level");
      },
      backBtnClicked: function backBtnClicked() {
        cc.director.loadScene("level");
      }
    });
    cc._RF.pop();
  }, {} ],
  levelUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "74759anlohAILcdKxKuWiqC", "levelUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        stagePrefab: cc.Prefab,
        pageView: cc.PageView,
        pageItem: cc.Node,
        _stageList: [],
        _pageList: [ cc.Node ]
      },
      onLoad: function onLoad() {
        this.addStage();
        this.initStageInfo();
      },
      onBtnBackClicked: function onBtnBackClicked() {
        cc.director.loadScene("main");
      },
      addStage: function addStage() {
        for (var i = 0; i < window.PAGE_COUNT; i++) {
          var page = cc.instantiate(this.pageItem);
          for (var j = window.STAGE_COUNT * i; j < window.STAGE_COUNT * (i + 1); j++) {
            var stage = cc.instantiate(this.stagePrefab);
            stage.parent = page;
            this._stageList[j] = stage;
          }
          page.parent = this.pageView.content;
          page.active = true;
          this._pageList[i] = page;
        }
      },
      initStageInfo: function initStageInfo() {
        var _this = this;
        var stageInfo = window.dataManager.getStageInfo();
        var _loop = function _loop() {
          var info = {
            id: i + 1,
            star: 0,
            isOpen: true
          };
          if (null != stageInfo[i + 1]) {
            info.star = stageInfo[i + 1];
            info.isOpen = true;
          } else {
            info.star = 0;
            info.isOpen = false;
          }
          _this._stageList[i].getComponent("stage").initStageInfo(info, function() {
            window.dataManager.curLevel = info.id;
            cc.director.loadScene("game");
          });
        };
        for (var i = 0; i < window.STAGE_COUNT; i++) _loop();
      }
    });
    cc._RF.pop();
  }, {} ],
  level: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a35a5e+sZlCD5CWM4sS1oHM", "level");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        ball: cc.Prefab,
        door: cc.Prefab,
        spring: cc.Prefab,
        square: cc.Prefab,
        star: cc.Prefab,
        triangle: cc.Prefab,
        road1: cc.Prefab
      },
      onLoad: function onLoad() {
        this.init();
      },
      init: function init() {
        var _this = this;
        var url = "json/levelNode_" + window.dataManager.curLevel;
        cc.loader.loadRes(url, function(err, jsonText) {
          if (err) {
            cc.log("load json err");
            return;
          }
          cc.log(jsonText.json);
          _this.initObj(jsonText.json);
        });
      },
      initObj: function initObj(data) {
        for (var i = 0; i < data.length; i++) {
          var t = data[i];
          var obj = window.poolManager.get(t.name);
          obj.position = cc.v2(t.x, t.y);
          obj.scaleX = t.scaleX;
          obj.scaleY = t.scaleY;
          obj.angle = t.angle;
          if (t.dir && t.moveDis && t.moveTime) {
            var moveAct = obj.addComponent("moveAct");
            moveAct.move(t.dir, t.moveDis, t.moveTime);
          }
          t.forceValue && (obj.getComponent("spring").forceValue = t.forceValue);
          t.boomValue && (obj.getComponent("boom").boomValue = t.boomValue);
          obj.parent = this.node;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  mainUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6c654HHgNlFxIAODhEgh4FK", "mainUI");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        ballPrefab: cc.Prefab,
        physicNode: cc.Node
      },
      onLoad: function onLoad() {
        window.poolManager.initPool();
        this.schedule(function() {
          this.createBall();
        }, 1);
      },
      btnPlayClicked: function btnPlayClicked() {
        cc.director.loadScene("level");
      },
      createBall: function createBall() {
        var ball = window.poolManager.get("ball");
        var dir = Math.random() > .5 ? 1 : -1;
        var pos_x = dir * cc.winSize.width / 2;
        var pos_y = Math.random() * cc.winSize.height / 2;
        var force_x = (300 * Math.random() + 300) * -dir;
        var force_y = 200 * Math.random() * -1;
        var angular = (150 * Math.random() + 150) * -dir;
        ball.position = cc.v2(pos_x, pos_y);
        ball.getComponent(cc.RigidBody).linearVelocity = cc.v2(force_x, force_y);
        ball.getComponent(cc.PhysicsCircleCollider).restitution = .9;
        ball.getComponent(cc.RigidBody).angularVelocity = angular;
        ball.parent = this.physicNode;
      },
      editorClicked: function editorClicked() {
        cc.director.loadScene("editor");
      }
    });
    cc._RF.pop();
  }, {} ],
  moveAct: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21138imRDxGCbePL6UAwFvR", "moveAct");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        dir: 0,
        moveDis: 0,
        moveTime: .5
      },
      onLoad: function onLoad() {},
      move: function move(dir, moveDis, moveTime) {
        if (0 == dir) return;
        this.dir = dir;
        this.moveDis = moveDis;
        this.moveTime = moveTime;
        1 == this.dir ? this.node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(this.moveTime, -this.moveDis, 0), cc.moveBy(2 * this.moveTime, 2 * this.moveDis, 0), cc.moveBy(this.moveTime, -this.moveDis, 0)))) : this.node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(this.moveTime, 0, -this.moveDis), cc.moveBy(2 * this.moveTime, 0, 2 * this.moveDis), cc.moveBy(this.moveTime, 0, -this.moveDis))));
      }
    });
    cc._RF.pop();
  }, {} ],
  physics: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d2b2cZlg7ZDEKvhZn28PcG5", "physics");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        collisionManager.enabledDebugDraw = true;
      }
    });
    cc._RF.pop();
  }, {} ],
  poolManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a370buq4XpLaJESeXk1sH2u", "poolManager");
    "use strict";
    var poolManager = cc.Class({
      properties: {
        _poolList: null,
        _isInit: false
      },
      ctor: function ctor() {},
      initPool: function initPool() {
        var _this = this;
        if (this._isInit) return;
        this._ballPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/ball", function(err, pre) {
          if (err) {
            cc.log(" ball error ");
            return;
          }
          _this.ballPre = pre;
          for (var i = 0; i < 20; i++) {
            var ball = cc.instantiate(pre);
            _this._ballPool.put(ball);
          }
        });
        this._road1Pool = new cc.NodePool();
        cc.loader.loadRes("prefabs/road1", function(err, pre) {
          if (err) {
            cc.log(" road1 error ");
            return;
          }
          _this.road1Pre = pre;
          for (var i = 0; i < 5; i++) {
            var road1 = cc.instantiate(pre);
            _this._road1Pool.put(road1);
          }
        });
        this._road3Pool = new cc.NodePool();
        cc.loader.loadRes("prefabs/road3", function(err, pre) {
          if (err) {
            cc.log(" road3 error ");
            return;
          }
          _this.road3Pre = pre;
          for (var i = 0; i < 5; i++) {
            var road3 = cc.instantiate(pre);
            _this._road3Pool.put(road3);
          }
        });
        this._springPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/spring", function(err, pre) {
          if (err) {
            cc.log(" spring error ");
            return;
          }
          _this.springPre = pre;
          for (var i = 0; i < 5; i++) {
            var spring = cc.instantiate(pre);
            _this._springPool.put(spring);
          }
        });
        this._squarePool = new cc.NodePool();
        cc.loader.loadRes("prefabs/square", function(err, pre) {
          if (err) {
            cc.log(" square error ");
            return;
          }
          _this.squarePre = pre;
          for (var i = 0; i < 20; i++) {
            var square = cc.instantiate(pre);
            _this._squarePool.put(square);
          }
        });
        this._starPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/star", function(err, pre) {
          if (err) {
            cc.log(" star error ");
            return;
          }
          _this.starPre = pre;
          for (var i = 0; i < 5; i++) {
            var star = cc.instantiate(pre);
            _this._starPool.put(star);
          }
        });
        this._starEffectPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/star_effect", function(err, pre) {
          if (err) {
            cc.log(" star_effect error ");
            return;
          }
          _this.star_effectPre = pre;
          for (var i = 0; i < 5; i++) {
            var starEffect = cc.instantiate(pre);
            _this._starEffectPool.put(starEffect);
          }
        });
        this._starEffec2tPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/star_effect2", function(err, pre) {
          if (err) {
            cc.log(" star_effect2 error ");
            return;
          }
          _this.star_effect2 = pre;
          for (var i = 0; i < 5; i++) {
            var starEffect2 = cc.instantiate(pre);
            _this._starEffec2tPool.put(starEffect2);
          }
        });
        this._trianglePool = new cc.NodePool();
        cc.loader.loadRes("prefabs/triangle", function(err, pre) {
          if (err) {
            cc.log(" triangle error ");
            return;
          }
          _this.trianglePre = pre;
          for (var i = 0; i < 20; i++) {
            var triangle = cc.instantiate(pre);
            _this._trianglePool.put(triangle);
          }
        });
        this._doorPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/door", function(err, pre) {
          if (err) {
            cc.log(" door error ");
            return;
          }
          _this.doorPre = pre;
          for (var i = 0; i < 20; i++) {
            var door = cc.instantiate(pre);
            _this._doorPool.put(door);
          }
        });
        this._boomPool = new cc.NodePool();
        cc.loader.loadRes("prefabs/boom", function(err, pre) {
          if (err) {
            cc.log(" boom error ");
            return;
          }
          _this.boomPre = pre;
          for (var i = 0; i < 20; i++) {
            var boom = cc.instantiate(pre);
            _this._boomPool.put(boom);
          }
        });
        this._isInit = true;
        this._poolList = {
          ball: this._ballPool,
          road1: this._road1Pool,
          road3: this._road3Pool,
          spring: this._springPool,
          square: this._squarePool,
          star: this._starPool,
          star_effect: this._starEffectPool,
          star_effect2: this._starEffec2tPool,
          triangle: this._trianglePool,
          door: this._doorPool,
          boom: this._boomPool
        };
      },
      get: function get(name) {
        var pool = this._poolList[name];
        var node = null;
        null != pool && (node = pool.size() > 0 ? pool.get() : cc.instantiate(this[name + "Pre"]));
        return node;
      },
      put: function put(node) {
        var pool = this._poolList[node.name];
        null != pool && pool.put(node);
      },
      releaseAll: function releaseAll() {
        for (var i in this._poolList) this._poolList[i].clear();
      }
    });
    window.poolManager = new poolManager();
    cc._RF.pop();
  }, {} ],
  spring: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97c63T7KGNJnIxZgQjWfNOe", "spring");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        forceValue: 500,
        _forceVec: cc.v2(0, 0)
      },
      onLoad: function onLoad() {
        0 == this.node.angle ? this._forceVec = cc.v2(0, this.forceValue) : this.node.angle > 0 ? this._forceVec = cc.v2(-this.forceValue, 0) : this.node.angle < 0 && (this._forceVec = cc.v2(this.forceValue, 0));
        this._ani = this.node.getComponent(cc.Animation);
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        console.log("on collision enter");
        if ("ball" == other.node.group) {
          var spring = self.node.getComponent("spring");
          spring.playAnimation();
          var ball = other.node.parent.getComponent(cc.RigidBody);
          other.node.parent.runAction(cc.sequence(cc.delayTime(.05), cc.callFunc(function() {
            ball.linearVelocity = cc.v2(spring._forceVec.x + ball.linearVelocity.x, spring._forceVec.y + ball.linearVelocity.y);
          })));
        }
      },
      playAnimation: function playAnimation() {
        cc.log(" playAnimation ");
        this._ani.play("spring");
      }
    });
    cc._RF.pop();
  }, {} ],
  stage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8d231XjXIpMWKTk+1yFj0zi", "stage");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        starSP: cc.Sprite,
        starFrame: [ cc.SpriteFrame ],
        text: cc.Label,
        btnStage: cc.Button
      },
      onLoad: function onLoad() {},
      initStageInfo: function initStageInfo(info, callback) {
        this.starSP.spriteFrame = this.starFrame[info.star];
        this.btnStage.interactable = info.isOpen;
        this.text.string = "" + info.id;
        this.text.node.active = info.isOpen;
        this._callback = callback;
      },
      onStageClicked: function onStageClicked() {
        this._callback && this._callback();
      }
    });
    cc._RF.pop();
  }, {} ],
  star_effect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "23557juWUtPDoRPsm4nGlcU", "star_effect");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        var ani = this.node.getComponent(cc.Animation);
        ani.play("star_effect");
        ani.on("finished", this.onfinished, this);
      },
      onfinished: function onfinished() {
        cc.log("\u83b7\u5f97\u4e00\u661f");
        this.node.destroy();
      }
    });
    cc._RF.pop();
  }, {} ],
  star: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "35aefKKA89Ha7M70u6Hve4d", "star");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        effect: cc.Prefab
      },
      onLoad: function onLoad() {},
      Destroy: function Destroy() {
        var effect = cc.instantiate(this.effect);
        effect.parent = this.node.parent;
        effect.position = this.node.position;
        var moveAct = this.node.getComponent("moveAct");
        moveAct && this.node.removeComponent("moveAct");
        window.poolManager.put(this.node);
        cc.systemEvent.emit("updateStar");
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "Touch", "gameUI", "levelUI", "mainUI", "ball", "boom", "boomEffect", "level", "dataManager", "poolManager", "moveAct", "physics", "spring", "stage", "star", "star_effect" ]);