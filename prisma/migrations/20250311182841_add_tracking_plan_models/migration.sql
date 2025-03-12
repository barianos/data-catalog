-- CreateTable
CREATE TABLE "tracking_plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracking_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_plan_events" (
    "id" SERIAL NOT NULL,
    "trackingPlanId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "additionalProperties" BOOLEAN NOT NULL,

    CONSTRAINT "tracking_plan_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracking_plan_event_properties" (
    "id" SERIAL NOT NULL,
    "trackingPlanEventId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL,

    CONSTRAINT "tracking_plan_event_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "validationRules" TEXT,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_properties" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "required" BOOLEAN NOT NULL,

    CONSTRAINT "event_properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tracking_plans_name_key" ON "tracking_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tracking_plan_events_trackingPlanId_eventId_key" ON "tracking_plan_events"("trackingPlanId", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "tracking_plan_event_properties_trackingPlanEventId_property_key" ON "tracking_plan_event_properties"("trackingPlanEventId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "events_name_type_key" ON "events"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "properties_name_type_key" ON "properties"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "event_properties_eventId_propertyId_key" ON "event_properties"("eventId", "propertyId");

-- AddForeignKey
ALTER TABLE "tracking_plan_events" ADD CONSTRAINT "tracking_plan_events_trackingPlanId_fkey" FOREIGN KEY ("trackingPlanId") REFERENCES "tracking_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_plan_events" ADD CONSTRAINT "tracking_plan_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_plan_event_properties" ADD CONSTRAINT "tracking_plan_event_properties_trackingPlanEventId_fkey" FOREIGN KEY ("trackingPlanEventId") REFERENCES "tracking_plan_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracking_plan_event_properties" ADD CONSTRAINT "tracking_plan_event_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_properties" ADD CONSTRAINT "event_properties_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_properties" ADD CONSTRAINT "event_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
