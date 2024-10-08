/**
 * @swagger
 * tags:
 *   name: Timer
 *   description: Timer management
 */

/**
 * @swagger
 * /submit-reaction-time:
 *   post:
 *     summary: Submit a new reaction time
 *     tags: [Timer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               time:
 *                 type: number
 *                 example: 42
 *     responses:
 *       200:
 *         description: Reaction time submitted successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /get-reaction-times:
 *   get:
 *     summary: Retrieve all reaction times for the logged-in user
 *     tags: [Timer]
 *     responses:
 *       200:
 *         description: List of reaction times
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: string
 *                   time:
 *                     type: number
 *       404:
 *         description: No data found
 *       500:
 *         description: Server error
 */
