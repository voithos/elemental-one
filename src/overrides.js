/**
 * Contains overrides for Phaser.js necessary for the game
 */
if (typeof Phaser !== 'undefined') {
    /**
     * These changes were required to allow for top-only collision platforms.
     * Otherwise, any collision between the player's body and the platform
     * would move the player above the platform immediately.
     */
    Phaser.Physics.Arcade.prototype.separateTileX = function(body, tile, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (body.immovable || body.deltaX() === 0 || Phaser.Rectangle.intersects(body.hullX, tile) === false)
        {
            return false;
        }

        this._overlap = 0;

        //  The hulls overlap, let's process it
        this._maxOverlap = body.deltaAbsX() + this.OVERLAP_BIAS;

        if (body.deltaX() < 0)
        {
            //  Moving left
            this._overlap = tile.right - body.hullX.x;

            if ((this._overlap > this._maxOverlap && !tile.tile.disableMaxOverlapCheck) || body.allowCollision.left === false || tile.tile.collideRight === false)
            // if (body.allowCollision.left === false || tile.tile.collideRight === false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.left = true;
            }
        }
        else
        {
            //  Moving right
            this._overlap = body.hullX.right - tile.x;

            if ((this._overlap > this._maxOverlap && !tile.tile.disableMaxOverlapCheck) || body.allowCollision.right === false || tile.tile.collideLeft === false)
            // if (body.allowCollision.right === false || tile.tile.collideLeft === false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.right = true;
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap !== 0)
        {
            if (separate)
            {
                if (body.deltaX() < 0)
                {
                    body.x = body.x + this._overlap;
                }
                else
                {
                    body.x = body.x - this._overlap;
                }

                if (body.bounce.x === 0)
                {
                    body.velocity.x = 0;
                }
                else
                {
                    body.velocity.x = -body.velocity.x * body.bounce.x;
                }

                body.updateHulls();
            }

            return true;
        }
        else
        {
            return false;
        }

    };

    Phaser.Physics.Arcade.prototype.separateTileY = function(body, tile, separate) {

        //  Can't separate two immovable objects (tiles are always immovable)
        if (body.immovable || body.deltaY() === 0 || Phaser.Rectangle.intersects(body.hullY, tile) === false)
        {
            return false;
        }

        this._overlap = 0;

        //  The hulls overlap, let's process it
        this._maxOverlap = body.deltaAbsY() + this.OVERLAP_BIAS;

        if (body.deltaY() < 0)
        {
            //  Moving up
            this._overlap = tile.bottom - body.hullY.y;

            if ((this._overlap > this._maxOverlap && !tile.tile.disableMaxOverlapCheck) || body.allowCollision.up === false || tile.tile.collideDown === false)
            // if (body.allowCollision.up === false || tile.tile.collideDown === false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.up = true;
            }
        }
        else
        {
            //  Moving down
            this._overlap = body.hullY.bottom - tile.y;

            if ((this._overlap > this._maxOverlap && !tile.tile.disableMaxOverlapCheck) || body.allowCollision.down === false || tile.tile.collideUp === false)
            // if (body.allowCollision.down === false || tile.tile.collideUp === false)
            {
                this._overlap = 0;
            }
            else
            {
                body.touching.down = true;
            }
        }

        //  Then adjust their positions and velocities accordingly (if there was any overlap)
        if (this._overlap !== 0)
        {
            if (separate)
            {
                if (body.deltaY() < 0)
                {
                    body.y = body.y + this._overlap;
                }
                else
                {
                    body.y = body.y - this._overlap;
                }

                if (body.bounce.y === 0)
                {
                    body.velocity.y = 0;
                }
                else
                {
                    body.velocity.y = -body.velocity.y * body.bounce.y;
                }

                body.updateHulls();
            }

            return true;
        }
        else
        {
            return false;
        }

    };

    /**
     * These changes were required for proper positioning of item
     * when being acquired.
     */
    Phaser.Physics.Arcade.prototype.moveToXY = function(displayObject, x, y, speed, maxTime) {

        if (typeof speed === 'undefined') { speed = 60; }
        if (typeof maxTime === 'undefined') { maxTime = 0; }

        this._angle = Math.atan2(y - displayObject.body.y, x - displayObject.body.x);
        
        if (maxTime > 0)
        {
            //  We know how many pixels we need to move, but how fast?
            speed = this.distanceToXY(displayObject, x, y) / (maxTime / 1000);
        }
        
        displayObject.body.velocity.x = Math.cos(this._angle) * speed;
        displayObject.body.velocity.y = Math.sin(this._angle) * speed;

        return this._angle;

    };

    Phaser.Physics.Arcade.prototype.distanceToXY = function(displayObject, x, y) {

        this._dx = displayObject.body.x - x;
        this._dy = displayObject.body.y - y;
        
        return Math.sqrt(this._dx * this._dx + this._dy * this._dy);

    };

    Phaser.Physics.Arcade.prototype.angleToXY = function(displayObject, x, y) {

        this._dx = x - displayObject.body.x;
        this._dy = y - displayObject.body.y;
        
        return Math.atan2(this._dy, this._dx);

    };


    /**
     * These changes were required to allow for flipping of particles
     */
    Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function() {

        var particle = this.getFirstExists(false);

        if (particle == null)
        {
            return;
        }

        if (this.width > 1 || this.height > 1)
        {
            particle.reset(this.game.rnd.integerInRange(this.left, this.right), this.game.rnd.integerInRange(this.top, this.bottom));
        }
        else
        {
            particle.reset(this.emitX, this.emitY);
        }

        particle.lifespan = this.lifespan;

        particle.body.bounce.setTo(this.bounce.x, this.bounce.y);

        if (this.minParticleSpeed.x != this.maxParticleSpeed.x)
        {
            particle.body.velocity.x = this.game.rnd.integerInRange(this.minParticleSpeed.x, this.maxParticleSpeed.x);
            if (this.flipped) {
                particle.body.velocity.x *= -1;
            }
        }
        else
        {
            particle.body.velocity.x = this.minParticleSpeed.x;
            if (this.flipped) {
                particle.body.velocity.x *= -1;
            }
        }

        if (this.minParticleSpeed.y != this.maxParticleSpeed.y)
        {
            particle.body.velocity.y = this.game.rnd.integerInRange(this.minParticleSpeed.y, this.maxParticleSpeed.y);
        }
        else
        {
            particle.body.velocity.y = this.minParticleSpeed.y;
        }

        particle.body.gravity.y = this.gravity;

        if (this.minRotation != this.maxRotation)
        {
            particle.body.angularVelocity = this.game.rnd.integerInRange(this.minRotation, this.maxRotation);
        }
        else
        {
            particle.body.angularVelocity = this.minRotation;
        }

        if (this.minParticleScale !== 1 || this.maxParticleScale !== 1)
        {
            var scale = this.game.rnd.realInRange(this.minParticleScale, this.maxParticleScale);
            if (this.flipped) {
                particle.scale.setTo(-scale, scale);
            } else {
                particle.scale.setTo(scale, scale);
            }
        }

        particle.body.drag.x = this.particleDrag.x;
        particle.body.drag.y = this.particleDrag.y;
        particle.body.angularDrag = this.angularDrag;

    };
}
