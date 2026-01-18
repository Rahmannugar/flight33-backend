/**
 * @openapi
 * components:
 *   schemas:
 *     FlightSegment:
 *       type: object
 *       properties:
 *         from:
 *           type: string
 *           example: "LOS"
 *         to:
 *           type: string
 *           example: "JFK"
 *         departureTime:
 *           type: string
 *           example: "2026-02-10T08:10:00"
 *         arrivalTime:
 *           type: string
 *           example: "2026-02-10T19:15:00"
 *       required: [from, to, departureTime, arrivalTime]
 *
 *     Flight:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "cc09190c-0"
 *         airline:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "AA"
 *             name:
 *               type: string
 *               example: "American Airlines"
 *           required: [code, name]
 *         price:
 *           type: number
 *           example: 820.45
 *         stops:
 *           type: number
 *           example: 1
 *         durationMinutes:
 *           type: number
 *           example: 845
 *         segments:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/FlightSegment"
 *       required: [id, airline, price, stops, durationMinutes, segments]
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               example: "VALIDATION_ERROR"
 *             message:
 *               type: string
 *               example: "Invalid flight search input"
 *             details:
 *               nullable: true
 *           required: [code, message]
 *       required: [error]
 */
export const schemas = {};
