/**
 * @swagger
 * tags:
 *   name: Timer
 *   description: Operations for managing reaction times
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Timer:
 *       type: object
 *       required:
 *         - user_id
 *         - time
 *       properties:
 *         user_id:
 *           type: string
 *           description: The ID of the user who submitted the time
 *         time:
 *           type: number
 *           description: The reaction time in milliseconds
 */

/**
 * @swagger
 * /submit-reaction-time:
 *   post:
 *     summary: Submit a reaction time
 *     tags: [Timer]
 *     security:
 *       - bearerAuth: []  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Timer'
 *     responses:
 *       200:
 *         description: Reaction time submitted successfully
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /get-reaction-times:
 *   get:
 *     summary: Retrieve all reaction times for the logged-in user
 *     tags: [Timer]
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       200:
 *         description: List of reaction times
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Timer'
 *       404:
 *         description: No data found for the user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:        
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
