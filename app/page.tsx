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
  // Steelpy properties
  sectionClass?: string
  sectionName?: string
  shapeType?: string
  role?: string
  // Plate properties
  thickness?: string
  width?: string
  clipping?: string
  // Common properties
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

export default function StructuralCalculationsPage() {
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
    memberType: "steelpy", // "steelpy" or "plate"
    memberName: "",
    // Steelpy member properties
    sectionClass: "W_shapes",
    sectionName: "W21X83",
    shapeType: "W",
    role: "BEAM",
    loadingCondition: "1",
    // Plate properties
    thickness: "0.625",
    width: "10",
    clipping: "0",
    // Common properties
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

    // Reset member form
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

    // Reset bolt config form
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

    // Reset global loads form
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

    // Reset connection form
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

  const calculateConnectionResults = () => {
    const selectedConnection = connections.find((conn) => conn.id === selectedConnectionId)
    if (!selectedConnection) return null

    const selectedGlobalLoads = globalLoads.find((loads) => loads.id === selectedConnection.globalLoadsId)
    const selectedBoltConfig = boltConfigurations.find((config) => config.id === selectedConnection.boltConfigurationId)

    if (!selectedGlobalLoads || !selectedBoltConfig) return null

    const directLoad = Number.parseFloat(selectedGlobalLoads.directLoad) || 0
    const boltDiameter = Number.parseFloat(selectedBoltConfig.boltDiameter) || 0.875
    const nBolts = Number(selectedBoltConfig.nRows) * Number(selectedBoltConfig.nColumns)
    const Fu = 65 // ksi for A325 bolts
    const boltArea = (Math.PI * Math.pow(boltDiameter, 2)) / 4

    return {
      connection: selectedConnection,
      boltConfig: selectedBoltConfig,
      loads: selectedGlobalLoads,
      boltShearCapacity: (nBolts * 0.6 * Fu * boltArea) / 2.0,
      boltTensileCapacity: (nBolts * 0.75 * Fu * boltArea) / 2.0,
      appliedLoad: directLoad,
      utilizationRatio: directLoad / ((nBolts * 0.6 * Fu * boltArea) / 2.0),
      safetyCheck: directLoad <= (nBolts * 0.6 * Fu * boltArea) / 2.0 ? "SAFE" : "UNSAFE",
    }
  }

  const results = calculateConnectionResults()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold mb-4 text-foreground text-balance">
            Structural Connection Design Calculator
          </h1>
          <p className="text-xl text-muted max-w-3xl mx-auto text-pretty">
            Professional engineering calculations for limit states of structural connections with LaTeX-rendered
            formulas and comprehensive design verification.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading font-bold">Created Bolt Configurations</CardTitle>
            <CardDescription>Manage reusable bolt configuration templates</CardDescription>
          </CardHeader>
          <CardContent>
            {boltConfigurations.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>No bolt configurations created yet. Add configurations using the form below.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {boltConfigurations.map((config) => (
                  <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        BOLT CONFIG
                      </Badge>
                      <div>
                        <h4 className="font-heading font-semibold">{config.name}</h4>
                        <div className="text-sm text-muted space-x-4">
                          <span>
                            Pattern: {config.nRows}×{config.nColumns}
                          </span>
                          <span>
                            Spacing: {config.rowSpacing}"×{config.columnSpacing}"
                          </span>
                          <span>Diameter: {config.boltDiameter}"</span>
                          <span>Grade: {config.boltGrade}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBoltConfiguration(config.id)}
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
                  <Select value={selectedConnectionId} onValueChange={setSelectedConnectionId}>
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

                {results && (
                  <div className="space-y-6 p-6 bg-muted/30 rounded-lg border">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-heading font-semibold mb-3">Connection Details</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Connection:</strong> {results.connection.name}</p>
                          <p><strong>Member A:</strong> {results.connection.memberA.name} ({results.connection.componentA})</p>
                          <p><strong>Member B:</strong> {results.connection.memberB.name} ({results.connection.componentB})</p>
                          <p><strong>Bolt Pattern:</strong> {results.boltConfig.nRows} × {results.boltConfig.nColumns}</p>
                          <p><strong>Bolt Diameter:</strong> {results.boltConfig.boltDiameter}"</p>
                          <p><strong>Applied Load:</strong> {results.appliedLoad} kip</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold mb-3">Load Components</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Fx:</strong> {results.loads.fx} kip</p>
                          <p><strong>Fy:</strong> {results.loads.fy} kip</p>
                          <p><strong>Fz:</strong> {results.loads.fz} kip</p>
                          <p><strong>Mx:</strong> {results.loads.mx} kip-in</p>
                          <p><strong>My:</strong> {results.loads.my} kip-in</p>
                          <p><strong>Mz:</strong> {results.loads.mz} kip-in</p>
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
                            Where: n = {Number(results.boltConfig.nRows) * Number(results.boltConfig.nColumns)} bolts, F<sub>u</sub> = 65 ksi, d = {results.boltConfig.boltDiameter}", γ<sub>s</sub> = 2.0
                          </p>
                          <p className="font-semibold">
                            V<sub>r</sub> = {results.boltShearCapacity.toFixed(2)} kip
                          </p>
                        </div>

                        <div className="p-4 bg-background rounded border">
                          <h5 className="font-semibold mb-2">Bolt Tensile Capacity</h5>
                          <div className="bg-muted p-3 rounded font-mono text-sm mb-2">
                            T<sub>r</sub> = n × 0.75 × F<sub>u</sub> × A<sub>s</sub> × (1/γ<sub>s</sub>)
                          </div>
                          <p className="text-sm text-muted mb-2">
                            Where: A<sub>s</sub> = stress area of bolt thread
                          </p>
                          <p className="font-semibold">
                            T<sub>r</sub> = {results.boltTensileCapacity.toFixed(2)} kip
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
                              className={results.safetyCheck === "SAFE" ? "bg-green-100 text-green-800 border-green-200" : ""}
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading font-bold">Created Global Loads</CardTitle>
            <CardDescription>Manage reusable load case templates</CardDescription>
          </CardHeader>
          <CardContent>
            {globalLoads.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>No global loads created yet. Add load cases using the form below.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {globalLoads.map((loads) => (
                  <div key={loads.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        LOADS
                      </Badge>
                      <div>
                        <h4 className="font-heading font-semibold">{loads.name}</h4>
                        <div className="text-sm text-muted space-x-4">
                          <span>
                            Forces: Fx={loads.fx}, Fy={loads.fy}, Fz={loads.fz} kip
                          </span>
                          <span>
                            Moments: Mx={loads.mx}, My={loads.my}, Mz={loads.mz} kip-ft
                          </span>
                          <span>Direct: {loads.directLoad} kip</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeGlobalLoads(loads.id)}
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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading font-bold">Created Connections</CardTitle>
            <CardDescription>Manage your structural connections for design calculations</CardDescription>
          </CardHeader>
          <CardContent>
            {connections.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>No connections created yet. Add connections using the form below.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {connections.map((connection) => {
                  const boltConfig = boltConfigurations.find((config) => config.id === connection.boltConfigurationId)
                  const loads = globalLoads.find((loads) => loads.id === connection.globalLoadsId)

                  return (
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
                            <span>
                              Member A: {connection.memberA.name} ({connection.componentA})
                            </span>
                            <span>
                              Member B: {connection.memberB.name} ({connection.componentB})
                            </span>
                            <span>Bolts: {boltConfig ? `${boltConfig.nRows}×${boltConfig.nColumns}` : "N/A"}</span>
                            <span>Load: {loads ? loads.directLoad : "N/A"} kip</span>
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
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading font-bold">Created Members</CardTitle>
            <CardDescription>Manage your structural members for connection design</CardDescription>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-8 text-muted">
                <p>No members created yet. Add members using the form below.</p>
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
                          {member.type === "steelpy" ? (
                            <>
                              <span>Section: {member.sectionName}</span>
                              <span>Role: {member.role}</span>
                            </>
                          ) : (
                            <>
                              <span>Thickness: {member.thickness}"</span>
                              <span>Width: {member.width}"</span>
                            </>
                          )}
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Parameters */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading font-bold">Create New Bolt Configuration</CardTitle>
                <CardDescription>Define reusable bolt pattern and properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="boltConfigName">Configuration Name (optional)</Label>
                  <Input
                    id="boltConfigName"
                    placeholder="e.g., Standard 2x7 Pattern"
                    value={inputs.boltConfigName}
                    onChange={(e) => handleInputChange("boltConfigName", e.target.value)}
                    className="bg-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rowSpacing">Row Spacing (in)</Label>
                    <Input
                      id="rowSpacing"
                      type="number"
                      step="0.1"
                      placeholder="3.0"
                      value={inputs.rowSpacing}
                      onChange={(e) => handleInputChange("rowSpacing", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="columnSpacing">Column Spacing (in)</Label>
                    <Input
                      id="columnSpacing"
                      type="number"
                      step="0.1"
                      placeholder="3.0"
                      value={inputs.columnSpacing}
                      onChange={(e) => handleInputChange("columnSpacing", e.target.value)}
                      className="bg-input"
                    />
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="edgeDistanceVertical">Edge Distance Vertical (in)</Label>
                    <Input
                      id="edgeDistanceVertical"
                      type="number"
                      step="0.1"
                      placeholder="2.0"
                      value={inputs.edgeDistanceVertical}
                      onChange={(e) => handleInputChange("edgeDistanceVertical", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edgeDistanceHorizontal">Edge Distance Horizontal (in)</Label>
                    <Input
                      id="edgeDistanceHorizontal"
                      type="number"
                      step="0.1"
                      placeholder="1.5"
                      value={inputs.edgeDistanceHorizontal}
                      onChange={(e) => handleInputChange("edgeDistanceHorizontal", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boltDiameter">Bolt Diameter (in)</Label>
                    <Select
                      value={inputs.boltDiameter}
                      onValueChange={(value) => handleInputChange("boltDiameter", value)}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select diameter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">1/2"</SelectItem>
                        <SelectItem value="0.625">5/8"</SelectItem>
                        <SelectItem value="0.75">3/4"</SelectItem>
                        <SelectItem value="0.875">7/8"</SelectItem>
                        <SelectItem value="1.0">1"</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="boltGrade">Bolt Grade</Label>
                    <Select value={inputs.boltGrade} onValueChange={(value) => handleInputChange("boltGrade", value)}>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A325-X">A325-X</SelectItem>
                        <SelectItem value="A325-N">A325-N</SelectItem>
                        <SelectItem value="A490-X">A490-X</SelectItem>
                        <SelectItem value="A490-N">A490-N</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="angle">Connection Angle (degrees)</Label>
                    <Input
                      id="angle"
                      type="number"
                      step="0.1"
                      placeholder="47.2"
                      value={inputs.angle}
                      onChange={(e) => handleInputChange("angle", e.target.value)}
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
                <div className="space-y-2">
                  <Label htmlFor="globalLoadsName">Load Case Name (optional)</Label>
                  <Input
                    id="globalLoadsName"
                    placeholder="e.g., Wind Load Case 1"
                    value={inputs.globalLoadsName}
                    onChange={(e) => handleInputChange("globalLoadsName", e.target.value)}
                    className="bg-input"
                  />
                </div>

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
                    <Label htmlFor="fz">Fz (kip)</Label>
                    <Input
                      id="fz"
                      type="number"
                      placeholder="0"
                      value={inputs.fz}
                      onChange={(e) => handleInputChange("fz", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mx">Mx (kip-ft)</Label>
                    <Input
                      id="mx"
                      type="number"
                      placeholder="0"
                      value={inputs.mx}
                      onChange={(e) => handleInputChange("mx", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="my">My (kip-ft)</Label>
                    <Input
                      id="my"
                      type="number"
                      placeholder="0"
                      value={inputs.my}
                      onChange={(e) => handleInputChange("my", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mz">Mz (kip-ft)</Label>
                    <Input
                      id="mz"
                      type="number"
                      placeholder="0"
                      value={inputs.mz}
                      onChange={(e) => handleInputChange("mz", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2 col-span-3">
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
                <div>
                  <Label htmlFor="connectionName">Connection Name (optional)</Label>
                  <Input
                    id="connectionName"
                    placeholder="e.g., Beam-Column Connection"
                    value={inputs.connectionName}
                    onChange={(e) => handleInputChange("connectionName", e.target.value)}
                    className="bg-input"
                  />
                </div>

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
                  <div className="space-y-2">
                    <Label htmlFor="componentA">Component A</Label>
                    <Select value={inputs.componentA} onValueChange={(value) => handleInputChange("componentA", value)}>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TOTAL">TOTAL</SelectItem>
                        <SelectItem value="WEB">WEB</SelectItem>
                        <SelectItem value="FLANGE">FLANGE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="componentB">Component B</Label>
                    <Select value={inputs.componentB} onValueChange={(value) => handleInputChange("componentB", value)}>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select component" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TOTAL">TOTAL</SelectItem>
                        <SelectItem value="WEB">WEB</SelectItem>
                        <SelectItem value="FLANGE">FLANGE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="boltConfigurationId">Bolt Configuration</Label>
                    <Select
                      value={inputs.boltConfigurationId}
                      onValueChange={(value) => handleInputChange("boltConfigurationId", value)}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select bolt configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        {boltConfigurations.map((config) => (
                          <SelectItem key={config.id} value={config.id}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="globalLoadsId">Global Loads</Label>
                    <Select
                      value={inputs.globalLoadsId}
                      onValueChange={(value) => handleInputChange("globalLoadsId", value)}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select global loads" />
                      </SelectTrigger>
                      <SelectContent>
                        {globalLoads.map((loads) => (
                          <SelectItem key={loads.id} value={loads.id}>
                            {loads.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overrideAg">Override Gross Area (optional)</Label>
                  <Input
                    id="overrideAg"
                    type="number"
                    step="0.01"
                    placeholder="Leave blank to use calculated value"
                    value={inputs.overrideAg}
                    onChange={(e) => handleInputChange("overrideAg", e.target.value)}
                    className="bg-input"
                  />
                </div>

                <Button
                  onClick={addConnection}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add Connection to List
                </Button>
              </CardContent>
            </Card>

            {/* ... existing member creation section ... */}

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

                {inputs.memberType === "steelpy" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sectionClass">Section Class</Label>
                      <Select
                        value={inputs.sectionClass}
                        onValueChange={(value) => handleInputChange("sectionClass", value)}
                      >
                        <SelectTrigger className="bg-input">
                          <SelectValue placeholder="Select section class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="W_shapes">W Shapes (Wide Flange)</SelectItem>
                          <SelectItem value="L_shapes">L Shapes (Angles)</SelectItem>
                          <SelectItem value="C_shapes">C Shapes (Channels)</SelectItem>
                          <SelectItem value="HSS_shapes">HSS Shapes (Hollow)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sectionName">Section Name</Label>
                      <Select
                        value={inputs.sectionName}
                        onValueChange={(value) => handleInputChange("sectionName", value)}
                      >
                        <SelectTrigger className="bg-input">
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {inputs.sectionClass === "W_shapes" && (
                            <>
                              <SelectItem value="W21X83">W21X83</SelectItem>
                              <SelectItem value="W18X76">W18X76</SelectItem>
                              <SelectItem value="W24X94">W24X94</SelectItem>
                              <SelectItem value="W16X67">W16X67</SelectItem>
                              <SelectItem value="W14X90">W14X90</SelectItem>
                            </>
                          )}
                          {inputs.sectionClass === "L_shapes" && (
                            <>
                              <SelectItem value="L8X6X1">L8X6X1</SelectItem>
                              <SelectItem value="L6X4X1/2">L6X4X1/2"</SelectItem>
                              <SelectItem value="L4X4X1/2">L4X4X1/2</SelectItem>
                              <SelectItem value="L3X3X1/4">L3X3X1/4</SelectItem>
                            </>
                          )}
                          {inputs.sectionClass === "C_shapes" && (
                            <>
                              <SelectItem value="C15X50">C15X50</SelectItem>
                              <SelectItem value="C12X30">C12X30</SelectItem>
                              <SelectItem value="C10X25">C10X25</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shapeType">Shape Type</Label>
                      <Select value={inputs.shapeType} onValueChange={(value) => handleInputChange("shapeType", value)}>
                        <SelectTrigger className="bg-input">
                          <SelectValue placeholder="Select shape type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="W">W</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="HSS">HSS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Member Role</Label>
                      <Select value={inputs.role} onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger className="bg-input">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BEAM">BEAM</SelectItem>
                          <SelectItem value="COLUMN">COLUMN</SelectItem>
                          <SelectItem value="BRACE">BRACE</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="thickness">Thickness (in)</Label>
                      <Select value={inputs.thickness} onValueChange={(value) => handleInputChange("thickness", value)}>
                        <SelectTrigger className="bg-input">
                          <SelectValue placeholder="Select thickness" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.25">1/4"</SelectItem>
                          <SelectItem value="0.375">3/8"</SelectItem>
                          <SelectItem value="0.5">1/2"</SelectItem>
                          <SelectItem value="0.625">5/8"</SelectItem>
                          <SelectItem value="0.75">3/4"</SelectItem>
                          <SelectItem value="1.0">1"</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (in)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="10"
                        value={inputs.width}
                        onChange={(e) => handleInputChange("width", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clipping">Clipping (in)</Label>
                      <Input
                        id="clipping"
                        type="number"
                        placeholder="0"
                        value={inputs.clipping}
                        onChange={(e) => handleInputChange("clipping", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material Grade</Label>
                    <Select value={inputs.material} onValueChange={(value) => handleInputChange("material", value)}>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A992">A992</SelectItem>
                        <SelectItem value="A572_GR50">A572 Gr50</SelectItem>
                        <SelectItem value="A36">A36</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loadingCondition">Loading Condition</Label>
                    <Select
                      value={inputs.loadingCondition}
                      onValueChange={(value) => handleInputChange("loadingCondition", value)}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Normal</SelectItem>
                        <SelectItem value="2">2 - Bracing</SelectItem>
                        <SelectItem value="3">3 - Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="length">Member Length (ft)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="25"
                      value={inputs.length}
                      onChange={(e) => handleInputChange("length", e.target.value)}
                      className="bg-input"
                    />
                  </div>
                </div>

                <Button
                  onClick={addMember}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add Member to List
                </Button>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Calculate Connection Capacity
            </Button>
          </div>

          {/* ... existing results section ... */}

          {/* Design Formulas */}
          {/* Design Formulas section - keeping existing formulas for reference */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-heading font-bold">Design Formulas Reference</CardTitle>
            <CardDescription>Standard structural design formulas for limit states</CardDescription>
          </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-heading font-semibold mb-3">Bolt Shear Capacity</h4>
                  <div className="bg-muted/20 p-4 rounded-lg border">
                    <div className="text-center text-lg font-mono">
                      V<sub>r</sub> = n × 0.6 × F<sub>u</sub> × (πd²/4) × (1/γ<sub>s</sub>)
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2">
                    Where: n = number of bolts, F<sub>u</sub> = ultimate tensile strength, d = bolt diameter, γ
                    <sub>s</sub> = safety factor
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-semibold mb-3">Bolt Tensile Capacity</h4>
                  <div className="bg-muted/20 p-4 rounded-lg border">
                    <div className="text-center text-lg font-mono">
                      T<sub>r</sub> = n × 0.75 × F<sub>u</sub> × A<sub>s</sub> × (1/γ<sub>s</sub>)
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2">
                    Where: A<sub>s</sub> = stress area of bolt thread
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-semibold mb-3">Block Shear Capacity</h4>
                  <div className="bg-muted/20 p-4 rounded-lg border">
                    <div className="text-center text-lg font-mono">
                      V<sub>bs</sub> = min(0.6F<sub>u</sub>A<sub>nv</sub> + U<sub>bs</sub>F<sub>u</sub>A<sub>nt</sub>,
                      0.6F<sub>y</sub>A<sub>gv</sub> + U<sub>bs</sub>F<sub>u</sub>A<sub>nt</sub>)
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2">
                    Where: A<sub>nv</sub> = net shear area, A<sub>nt</sub> = net tension area, U<sub>bs</sub> = block
                    shear factor
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-semibold mb-3">Bearing Capacity</h4>
                  <div className="bg-muted/20 p-4 rounded-lg border">
                    <div className="text-center text-lg font-mono">
                      B<sub>r</sub> = 3.0 × d × t × F<sub>u</sub> × (1/γ<sub>b</sub>)
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2">
                    Where: d = bolt diameter, t = plate thickness, γ<sub>b</sub> = bearing resistance factor
                  </p>
                </div>

                <div>
                  <h4 className="font-heading font-semibold mb-3">Connection Resultant Force</h4>
                  <div className="bg-muted/20 p-4 rounded-lg border">
                    <div className="text-center text-lg font-mono">
                      P<sub>resultant</sub> = √(F<sub>x</sub>² + F<sub>y</sub>² + F<sub>z</sub>²) + √(M<sub>x</sub>² + M
                      <sub>y</sub>² + M<sub>z</sub>²)/e<sub>eff</sub>
                    </div>
                  </div>
                  <p className="text-sm text-muted mt-2">
                    Where: F<sub>x</sub>, F<sub>y</sub>\
