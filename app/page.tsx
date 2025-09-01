"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BoltConfiguration {
  id: string
  name: string
  rowSpacing: string
  columnSpacing: string
  nRows: string
  nColumns: string
  edgeDistanceVertical: string
  edgeDistanceHorizontal: string
  boltDiameter: string
  boltGrade: string
  angle: string
  connectionType: "bolted"
}

interface GlobalLoads {
  id: string
  name: string
  fx: string
  fy: string
  fz: string
  mx: string
  my: string
  mz: string
  directLoad: string
}

interface Member {
  id: string
  type: "steelpy" | "plate"
  name: string
  sectionClass?: string
  sectionName?: string
  shapeType?: string
  role?: string
  thickness?: string
  width?: string
  clipping?: string
  material: string
  loadingCondition: string
  length: string
}

interface Connection {
  id: string
  name: string
  memberA: Member
  memberB: Member
  componentA: string
  componentB: string
  connectionType: string
  boltConfigurationId: string
  globalLoadsId: string
  overrideAg?: string
}

export default function StructuralCalculator() {
  const [showCalculationResults, setShowCalculationResults] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [memberCounter, setMemberCounter] = useState(1)
  const [connections, setConnections] = useState<Connection[]>([])
  const [connectionCounter, setConnectionCounter] = useState(1)
  const [selectedConnectionId, setSelectedConnectionId] = useState<string>("")
  const [boltConfigurations, setBoltConfigurations] = useState<BoltConfiguration[]>([])
  const [boltConfigCounter, setBoltConfigCounter] = useState(1)
  const [globalLoads, setGlobalLoads] = useState<GlobalLoads[]>([])
  const [globalLoadsCounter, setGlobalLoadsCounter] = useState(1)

  const [inputs, setInputs] = useState({
    memberType: "steelpy",
    memberName: "",
    sectionClass: "W_shapes",
    sectionName: "W21X83",
    shapeType: "W",
    role: "BEAM",
    loadingCondition: "1",
    thickness: "0.625",
    width: "10",
    clipping: "0",
    material: "A992",
    length: "25",
    connectionName: "",
    memberA: "",
    memberB: "",
    componentA: "TOTAL",
    componentB: "TOTAL",
    connectionType: "bolted",
    boltConfigurationId: "",
    globalLoadsId: "",
    overrideAg: "",
    boltConfigName: "",
    rowSpacing: "3.0",
    columnSpacing: "3.0",
    nRows: "2",
    nColumns: "7",
    edgeDistanceVertical: "2.0",
    edgeDistanceHorizontal: "1.5",
    boltDiameter: "0.875",
    boltGrade: "A325-X",
    angle: "47.2",
    globalLoadsName: "",
    fx: "0",
    fy: "0",
    fz: "0",
    mx: "0",
    my: "0",
    mz: "0",
    directLoad: "150",
  })

  const handleInputChange = (field: string, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  const addMember = () => {
    const newMember: Member = {
      id: `member-${memberCounter}`,
      type: inputs.memberType as "steelpy" | "plate",
      name: inputs.memberName || `${inputs.memberType === "steelpy" ? inputs.sectionName : "Plate"} ${memberCounter}`,
      material: inputs.material,
      loadingCondition: inputs.loadingCondition,
      length: inputs.length,
    }

    if (inputs.memberType === "steelpy") {
      newMember.sectionClass = inputs.sectionClass
      newMember.sectionName = inputs.sectionName
      newMember.shapeType = inputs.shapeType
      newMember.role = inputs.role
    } else {
      newMember.thickness = inputs.thickness
      newMember.width = inputs.width
      newMember.clipping = inputs.clipping
    }

    setMembers((prev) => [...prev, newMember])
    setMemberCounter((prev) => prev + 1)

    setInputs((prev) => ({
      ...prev,
      memberName: "",
      memberType: "steelpy",
      sectionName: "W21X83",
      role: "BEAM",
      thickness: "0.625",
      width: "10",
      clipping: "0",
    }))
  }

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id))
  }

  const addBoltConfiguration = () => {
    const newBoltConfig: BoltConfiguration = {
      id: `bolt-config-${boltConfigCounter}`,
      name: inputs.boltConfigName || `Bolt Config ${boltConfigCounter}`,
      rowSpacing: inputs.rowSpacing,
      columnSpacing: inputs.columnSpacing,
      nRows: inputs.nRows,
      nColumns: inputs.nColumns,
      edgeDistanceVertical: inputs.edgeDistanceVertical,
      edgeDistanceHorizontal: inputs.edgeDistanceHorizontal,
      boltDiameter: inputs.boltDiameter,
      boltGrade: inputs.boltGrade,
      angle: inputs.angle,
      connectionType: "bolted",
    }

    setBoltConfigurations((prev) => [...prev, newBoltConfig])
    setBoltConfigCounter((prev) => prev + 1)

    setInputs((prev) => ({
      ...prev,
      boltConfigName: "",
      rowSpacing: "3.0",
      columnSpacing: "3.0",
      nRows: "2",
      nColumns: "7",
      edgeDistanceVertical: "2.0",
      edgeDistanceHorizontal: "1.5",
      boltDiameter: "0.875",
      boltGrade: "A325-X",
      angle: "47.2",
    }))
  }

  const removeBoltConfiguration = (id: string) => {
    setBoltConfigurations((prev) => prev.filter((config) => config.id !== id))
  }

  const addGlobalLoads = () => {
    const newGlobalLoads: GlobalLoads = {
      id: `global-loads-${globalLoadsCounter}`,
      name: inputs.globalLoadsName || `Global Loads ${globalLoadsCounter}`,
      fx: inputs.fx,
      fy: inputs.fy,
      fz: inputs.fz,
      mx: inputs.mx,
      my: inputs.my,
      mz: inputs.mz,
      directLoad: inputs.directLoad,
    }

    setGlobalLoads((prev) => [...prev, newGlobalLoads])
    setGlobalLoadsCounter((prev) => prev + 1)

    setInputs((prev) => ({
      ...prev,
      globalLoadsName: "",
      fx: "0",
      fy: "0",
      fz: "0",
      mx: "0",
      my: "0",
      mz: "0",
      directLoad: "150",
    }))
  }

  const removeGlobalLoads = (id: string) => {
    setGlobalLoads((prev) => prev.filter((loads) => loads.id !== id))
  }

  const addConnection = () => {
    const memberA = members.find((m) => m.id === inputs.memberA)
    const memberB = members.find((m) => m.id === inputs.memberB)

    if (!memberA || !memberB) {
      alert("Please select both Member A and Member B")
      return
    }

    if (!inputs.boltConfigurationId) {
      alert("Please select a bolt configuration")
      return
    }

    if (!inputs.globalLoadsId) {
      alert("Please select global loads")
      return
    }

    const newConnection: Connection = {
      id: `connection-${connectionCounter}`,
      name: inputs.connectionName || `Connection ${connectionCounter}`,
      memberA,
      memberB,
      componentA: inputs.componentA,
      componentB: inputs.componentB,
      connectionType: inputs.connectionType,
      boltConfigurationId: inputs.boltConfigurationId,
      globalLoadsId: inputs.globalLoadsId,
      overrideAg: inputs.overrideAg || undefined,
    }

    setConnections((prev) => [...prev, newConnection])
    setConnectionCounter((prev) => prev + 1)

    setInputs((prev) => ({
      ...prev,
      connectionName: "",
      memberA: "",
      memberB: "",
      boltConfigurationId: "",
      globalLoadsId: "",
      overrideAg: "",
    }))
  }

  const removeConnection = (id: string) => {
    setConnections((prev) => prev.filter((connection) => connection.id !== id))
  }

  const calculateResults = (connection: any, boltConfig: any, loads: any) => {
    const numBolts = Number(boltConfig.nRows) * Number(boltConfig.nColumns)
    const boltArea = (Math.PI * Math.pow(Number(boltConfig.boltDiameter), 2)) / 4
    const Fu = 65
    const gammaS = 2.0

    const boltShearCapacity = (numBolts * 0.6 * Fu * boltArea) / gammaS
    const boltTensileCapacity = (numBolts * 0.75 * Fu * boltArea * 0.75) / gammaS

    const appliedLoad =
      Math.sqrt(Math.pow(Number(loads.fx), 2) + Math.pow(Number(loads.fy), 2) + Math.pow(Number(loads.fz), 2)) +
      Number(loads.directLoad)

    const utilizationRatio = appliedLoad / Math.min(boltShearCapacity, boltTensileCapacity)
    const safetyCheck = utilizationRatio <= 1.0 ? "SAFE" : "UNSAFE"

    return {
      connection,
      boltConfig,
      loads,
      boltShearCapacity,
      boltTensileCapacity,
      appliedLoad,
      utilizationRatio,
      safetyCheck,
    }
  }

  const handleCalculateConnection = () => {
    if (!selectedConnectionId) return

    const connection = connections.find((c) => c.id === selectedConnectionId)
    if (!connection) return

    const boltConfig = boltConfigurations.find((config) => config.id === connection.boltConfigurationId)
    const loads = globalLoads.find((loads) => loads.id === connection.globalLoadsId)

    if (!boltConfig || !loads) return

    setShowCalculationResults(true)
  }

  const handleConnectionSelectionChange = (connectionId: string) => {
    setSelectedConnectionId(connectionId)
    setShowCalculationResults(false)
  }

  const getCalculationResults = () => {
    if (!selectedConnectionId || !showCalculationResults) return null

    const connection = connections.find((c) => c.id === selectedConnectionId)
    if (!connection) return null

    const boltConfig = boltConfigurations.find((config) => config.id === connection.boltConfigurationId)
    const loads = globalLoads.find((loads) => loads.id === connection.globalLoadsId)

    if (!boltConfig || !loads) return null

    return calculateResults(connection, boltConfig, loads)
  }

  const results = getCalculationResults()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground text-balance">
            Structural Connection Design Calculator
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto text-pretty">
            Professional engineering calculations for limit states of structural connections with comprehensive design
            verification.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading font-bold">Connection Analysis</CardTitle>
            <CardDescription>Select a connection to analyze and view detailed calculations</CardDescription>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>No connections available for analysis. Create connections first.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="selectedConnection">Select Connection to Analyze</Label>
                  <Select value={selectedConnectionId} onValueChange={handleConnectionSelectionChange}>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Choose a connection for analysis" />
                    </SelectTrigger>
                    <SelectContent>
                      {connections.map((connection) => (
                        <SelectItem key={connection.id} value={connection.id}>
                          {connection.name} ({connection.memberA.name} → {connection.memberB.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCalculateConnection}
                    disabled={!selectedConnectionId}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Calculate Connection
                  </Button>
                  {showCalculationResults && (
                    <Button variant="outline" onClick={() => setShowCalculationResults(false)}>
                      Clear Results
                    </Button>
                  )}
                </div>

                {results && (
                  <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-heading font-semibold mb-3">Connection Details</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Connection:</strong> {results.connection.name}
                          </p>
                          <p>
                            <strong>Member A:</strong> {results.connection.memberA.name} (
                            {results.connection.componentA})
                          </p>
                          <p>
                            <strong>Member B:</strong> {results.connection.memberB.name} (
                            {results.connection.componentB})
                          </p>
                          <p>
                            <strong>Bolt Pattern:</strong> {results.boltConfig.nRows} × {results.boltConfig.nColumns}
                          </p>
                          <p>
                            <strong>Bolt Diameter:</strong> {results.boltConfig.boltDiameter}"
                          </p>
                          <p>
                            <strong>Applied Load:</strong> {results.appliedLoad.toFixed(2)} kip
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold mb-3">Load Components</h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Fx:</strong> {results.loads.fx} kip
                          </p>
                          <p>
                            <strong>Fy:</strong> {results.loads.fy} kip
                          </p>
                          <p>
                            <strong>Fz:</strong> {results.loads.fz} kip
                          </p>
                          <p>
                            <strong>Mx:</strong> {results.loads.mx} kip-in
                          </p>
                          <p>
                            <strong>My:</strong> {results.loads.my} kip-in
                          </p>
                          <p>
                            <strong>Mz:</strong> {results.loads.mz} kip-in
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-heading font-semibold">Design Calculations</h4>

                      <div className="space-y-4">
                        <div className="p-4 bg-background rounded border">
                          <h5 className="font-semibold mb-2">Bolt Shear Capacity</h5>
                          <div className="bg-muted p-3 rounded font-mono text-sm mb-2">
                            V<sub>r</sub> = n × 0.6 × F<sub>u</sub> × (πd²/4) × (1/γ<sub>s</sub>)
                          </div>
                          <p className="text-sm text-muted mb-2">
                            Where: n = {Number(results.boltConfig.nRows) * Number(results.boltConfig.nColumns)} bolts, F
                            <sub>u</sub> = 65 ksi, d = {results.boltConfig.boltDiameter}", γ<sub>s</sub> = 2.0
                          </p>
                          <p className="font-semibold">
                            V<sub>r</sub> = {results.boltShearCapacity.toFixed(2)} kip
                          </p>
                        </div>

                        <div className="p-4 bg-background rounded border">
                          <h5 className="font-semibold mb-2">Safety Assessment</h5>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted">Applied Load:</p>
                              <p className="font-semibold">{results.appliedLoad.toFixed(2)} kip</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted">Utilization Ratio:</p>
                              <p className="font-semibold">{(results.utilizationRatio * 100).toFixed(1)}%</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Badge
                              variant={results.safetyCheck === "SAFE" ? "default" : "destructive"}
                              className={
                                results.safetyCheck === "SAFE" ? "bg-green-100 text-green-800 border-green-200" : ""
                              }
                            >
                              {results.safetyCheck}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold">Add New Member</CardTitle>
                <CardDescription>Define structural members for connection design</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="memberName">Member Name (optional)</Label>
                  <Input
                    id="memberName"
                    placeholder="e.g., Main Beam, Column A1"
                    value={inputs.memberName}
                    onChange={(e) => handleInputChange("memberName", e.target.value)}
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberType">Member Type</Label>
                  <Select value={inputs.memberType} onValueChange={(value) => handleInputChange("memberType", value)}>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select member type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="steelpy">Steel Section (W, L, C, etc.)</SelectItem>
                      <SelectItem value="plate">Custom Plate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={addMember}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add Member to List
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold">Create New Bolt Configuration</CardTitle>
                <CardDescription>Define reusable bolt pattern and properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nRows">Number of Rows</Label>
                    <Input
                      id="nRows"
                      type="number"
                      placeholder="2"
                      value={inputs.nRows}
                      onChange={(e) => handleInputChange("nRows", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nColumns">Number of Columns</Label>
                    <Input
                      id="nColumns"
                      type="number"
                      placeholder="7"
                      value={inputs.nColumns}
                      onChange={(e) => handleInputChange("nColumns", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                </div>

                <Button
                  onClick={addBoltConfiguration}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add Bolt Configuration to List
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold">Create New Global Loads</CardTitle>
                <CardDescription>Define reusable load case with 6-component load vector</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fx">Fx (kip)</Label>
                    <Input
                      id="fx"
                      type="number"
                      placeholder="0"
                      value={inputs.fx}
                      onChange={(e) => handleInputChange("fx", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fy">Fy (kip)</Label>
                    <Input
                      id="fy"
                      type="number"
                      placeholder="0"
                      value={inputs.fy}
                      onChange={(e) => handleInputChange("fy", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="directLoad">Direct Load (kip)</Label>
                    <Input
                      id="directLoad"
                      type="number"
                      placeholder="150"
                      value={inputs.directLoad}
                      onChange={(e) => handleInputChange("directLoad", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                </div>

                <Button
                  onClick={addGlobalLoads}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add Global Loads to List
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold">Create New Connection</CardTitle>
                <CardDescription>Define a connection between two structural members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberA">Member A</Label>
                    <Select value={inputs.memberA} onValueChange={(value) => handleInputChange("memberA", value)}>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select Member A" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memberB">Member B</Label>
                    <Select value={inputs.memberB} onValueChange={(value) => handleInputChange("memberB", value)}>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select Member B" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={addConnection}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add Connection to List
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold">Created Members</CardTitle>
                <CardDescription>Manage your structural members for connection design</CardDescription>
              </CardHeader>
              <CardContent>
                {members.length === 0 ? (
                  <div className="text-center py-8 text-muted">
                    <p>No members created yet. Add members using the form.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex items-center gap-4">
                          <Badge variant={member.type === "steelpy" ? "default" : "secondary"}>
                            {member.type === "steelpy" ? "Steel Section" : "Plate"}
                          </Badge>
                          <div>
                            <h4 className="font-heading font-semibold">{member.name}</h4>
                            <div className="text-sm text-muted space-x-4">
                              <span>Material: {member.material}</span>
                              <span>Length: {member.length} ft</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeMember(member.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold">Created Connections</CardTitle>
                <CardDescription>Manage your structural connections for design calculations</CardDescription>
              </CardHeader>
              <CardContent>
                {connections.length === 0 ? (
                  <div className="text-center py-8 text-muted">
                    <p>No connections created yet. Add connections using the form.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connections.map((connection) => (
                      <div
                        key={connection.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {connection.connectionType.toUpperCase()}
                          </Badge>
                          <div>
                            <h4 className="font-heading font-semibold">{connection.name}</h4>
                            <div className="text-sm text-muted space-x-4">
                              <span>Member A: {connection.memberA.name}</span>
                              <span>Member B: {connection.memberB.name}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeConnection(connection.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
